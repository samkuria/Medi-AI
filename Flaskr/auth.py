from flask import (
    Blueprint, flash, g, render_template, request, redirect, url_for, session
)
from werkzeug.security import check_password_hash, generate_password_hash
from Flaskr.db import get_db

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        db = get_db()
        error = None

        if not username:
            error = "Username is required!"
        elif not password:
            error = "Password is required!"

        if error is None:
            try:
                db.execute(
                    "INSERT into user (username, password) VALUES (?,?)",
                    (username, generate_password_hash(password))
                )
                db.commit()
            except db.IntegrityError:
                error = f"Username {username} already in use!"
            else:
                return redirect(url_for("auth.login"))
            
        flash(error)

    return render_template("auth/register.html")


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]
        db = get_db()
        error = None

        user = db.execute(
            "SELECT * FROM user WHERE username = ?", (username,).fetchone()
        )

        if user is None:
            error = "Incorrect username!"
        elif not check_password_hash(user["password"], password):
            error = "Incorrect password!"

        if error is None:
            session.clear()
            session["user_id"] = user["id"]
            return redirect(url_for("index"))
            
        flash(error)

    return render_template("auth/login.html")


