"""
Авторизация GameEnglish: регистрация, вход, выход, получение профиля.
Действие передаётся через ?action=register|login|me|logout
"""
import json
import os
import hashlib
import secrets
import psycopg2


def get_conn():
    return psycopg2.connect(
        dsn=os.environ["DATABASE_URL"],
        options=f"-c search_path={os.environ.get('MAIN_DB_SCHEMA', 'public')}"
    )


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def cors_headers():
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }


def ok(data: dict, status: int = 200):
    return {"statusCode": status, "headers": {**cors_headers(), "Content-Type": "application/json"}, "body": json.dumps(data)}


def err(msg: str, status: int = 400):
    return {"statusCode": status, "headers": {**cors_headers(), "Content-Type": "application/json"}, "body": json.dumps({"error": msg})}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers(), "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            return err("Invalid JSON")

    if not action:
        action = body.get("action", "")

    # register
    if action == "register":
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""

        if not username or not email or not password:
            return err("Заполни все поля")
        if len(username) < 3:
            return err("Имя должно быть не короче 3 символов")
        if len(password) < 6:
            return err("Пароль должен быть не короче 6 символов")
        if "@" not in email:
            return err("Некорректный email")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
        if cur.fetchone():
            conn.close()
            return err("Пользователь с таким именем или email уже существует")

        ph = hash_password(password)
        cur.execute(
            "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, ph)
        )
        user_id = cur.fetchone()[0]
        token = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
        conn.commit()
        conn.close()
        return ok({"token": token, "user": {"id": user_id, "username": username, "email": email, "level": 1, "xp": 0, "streak": 0}}, 201)

    # login
    if action == "login":
        login = (body.get("login") or "").strip().lower()
        password = body.get("password") or ""
        if not login or not password:
            return err("Введи логин и пароль")

        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT id, username, email, level, xp, streak FROM users WHERE (LOWER(username) = %s OR email = %s) AND password_hash = %s",
            (login, login, hash_password(password))
        )
        row = cur.fetchone()
        if not row:
            conn.close()
            return err("Неверный логин или пароль")

        user_id, username, email, level, xp, streak = row
        token = secrets.token_hex(32)
        cur.execute("INSERT INTO sessions (user_id, token) VALUES (%s, %s)", (user_id, token))
        conn.commit()
        conn.close()
        return ok({"token": token, "user": {"id": user_id, "username": username, "email": email, "level": level, "xp": xp, "streak": streak}})

    # me
    if action == "me":
        token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "").strip()
        if not token:
            return err("Не авторизован", 401)
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "SELECT u.id, u.username, u.email, u.level, u.xp, u.streak FROM users u JOIN sessions s ON s.user_id = u.id WHERE s.token = %s AND s.token != ''",
            (token,)
        )
        row = cur.fetchone()
        conn.close()
        if not row:
            return err("Сессия не найдена", 401)
        user_id, username, email, level, xp, streak = row
        return ok({"user": {"id": user_id, "username": username, "email": email, "level": level, "xp": xp, "streak": streak}})

    # logout
    if action == "logout":
        token = (event.get("headers") or {}).get("X-Authorization", "").replace("Bearer ", "").strip()
        if token:
            conn = get_conn()
            cur = conn.cursor()
            cur.execute("UPDATE sessions SET token = '' WHERE token = %s", (token,))
            conn.commit()
            conn.close()
        return ok({"ok": True})

    return err("Not found", 404)
