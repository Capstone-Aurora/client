from yak.web import app
from flask import request
from werkzeug import secure_filename
import os

blog_dir = app.config["PATH"]


@app.route("/media/", methods=["POST"])
def media():
    filename = request.files["f"].filename
    sec_filename = secure_filename(filename)
    path = os.path.join(blog_dir, sec_filename)
    if not os.path.exists(path):
        request.files["f"].save(path)
