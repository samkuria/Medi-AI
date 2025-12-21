from flask import (
    flash, Blueprint, request, url_for, render_template, redirect
                   )
from werkzeug.exceptions import abort
from Flaskr.auth import login_required
from Flaskr.db import get_db


bp = Blueprint("profiles", __name__)


