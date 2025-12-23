from flask import (
    flash, Blueprint, request, url_for, render_template, redirect
                   )
from werkzeug.exceptions import abort
from Flaskr.auth import login_required
from Flaskr.db import get_db


bp = Blueprint("profiles", __name__)

# To get user profile
# To get all/some therapists
""" def get_therapists():
    db = get_db()
    db.execute(
        "SELECT "
    ).fetchall() """
# To get single therapist
# To register new therapist


bp.route("/new-therapist", methods=["POST", "GET"])
@login_required
def new_therapist():
    if request.method == "POST":
        name = request.form["name"]
        bio = request.form["bio"]
        error = None
    if not name:
        error = "Please enter your name.."
    elif not bio:
        error = "Please write a little something about yourself."

    if error is not None:
        flash(error)
    else:
        db = get_db()
        db.execute(
            "INSERT INTO therapist (name, bio, user_id)"
            "VALUES (?, ?, ?)",
            (name, bio, g.user["id"])
        )
        db.commit()
        return redirect(url_for("profiles.get_therapists"))
    return render_template("therapist/newTherapist.html")



# To edit profile

