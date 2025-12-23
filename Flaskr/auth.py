import functools
from flask import (
    Blueprint, flash, g, render_template, request, redirect, url_for, session
)
from werkzeug.security import check_password_hash, generate_password_hash
from Flaskr.db import get_db

bp = Blueprint("auth", __name__, url_prefix="/auth")


@bp.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        password_repeat = request.form["password-repeat"]
        db = get_db()
        error = None

        if not email:
            error = "Email is required!"
        elif not password:
            error = "Password is required!"
        elif password != password_repeat:
            error = "Passwords do not match!"

        if error is None:
            try:
                db.execute(
                    "INSERT into user (email, password) VALUES (?,?)",
                    (email, generate_password_hash(password))
                )
                db.commit()
            except db.IntegrityError:
                error = f"Email {email} already in use!"
            else:
                return redirect(url_for("auth.login"))
            
        flash(error)

    return render_template("auth/register.html")


@bp.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        db = get_db()
        error = None

        user = db.execute(
            "SELECT * FROM user WHERE email = ?", (email,)
        ).fetchone()

        if user is None:
            error = "Incorrect email!"
        elif not check_password_hash(user["password"], password):
            error = "Incorrect password!"

        if error is None:
            session.clear()
            session["user_id"] = user["id"]
            return redirect(url_for("index"))
            
        flash(error)

    return render_template("auth/login.html")


@bp.before_app_request
def load_logged_in_user():
    user_id = session.get("user_id")

    if user_id is None:
        g.user = None

    else:
        g.user = get_db().execute(
            "SELECT * FROM user WHERE id = ?", (user_id)
        ).fetchone()


def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("auth.login"))
        return view(**kwargs)
    return wrapped_view
    
@bp.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))