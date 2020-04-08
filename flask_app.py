
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config["DEBUG"] = True

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="harshitgarg",
    password="VKfqqvQB89M5hkS4tu1r",
    hostname="harshitgarg.mysql.pythonanywhere-services.com",
    databasename="harshitgarg$comments",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Comment(db.Model):

    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key = True)
    content = db.Column(db.String(4096))

@app.route('/', methods = ["GET", "POST"])
def index():
    if request.method == "GET" :
        return render_template("index.html", comments_disp = Comment.query.all())

    comment = Comment(content = request.form["contents"])
    db.session.add(comment)
    db.session.commit()

    return redirect(url_for('index'))


@app.route('/stats', methods = ["GET", "POST"])
def stats():
    if request.method == "GET" :
        return render_template("stats.html", comments_disp = Comment.query.all())

    comment = Comment(content = request.form["contents"])
    db.session.add(comment)
    db.session.commit()

    return redirect(url_for('stats'))


@app.route('/submit', methods = ["GET", "POST"])
def submit():
    if request.method == "GET" :
        return render_template("submit.html", comments_disp = Comment.query.all())

    comment = Comment(content = request.form["contents"])
    db.session.add(comment)
    db.session.commit()

    return redirect(url_for('submit'))


@app.route('/about', methods = ["GET", "POST"])
def about():
    if request.method == "GET" :
        return render_template("about.html", comments_disp = Comment.query.all())

    comment = Comment(content = request.form["contents"])
    db.session.add(comment)
    db.session.commit()

    return redirect(url_for('about'))

