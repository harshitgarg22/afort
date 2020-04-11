from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
from mysql_pass import MYSQL_PASS

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.config["DEBUG"] = True

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="harshitgarg",
    password=MYSQL_PASS,
    hostname="harshitgarg.mysql.pythonanywhere-services.com",
    databasename="harshitgarg$trees",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)

@app.route('/', methods = ["GET"])
def index():
    # if request.method == "GET" :
        # return render_template("index.html", comments_disp = Comment.query.all())

    return render_template('index.html')


@app.route('/stats', methods = ["GET"])
def stats():
    # return render_template("stats.html", comments_disp = Comment.query.all())
    return render_template("stats.html")

@app.route('/submit', methods = ["GET", "POST"])
def submit():

    if request.method == "POST":

        # create directory for this model with name as initials of model name

        index = ''
        initials = [word[0] for word in str(request.form["modelName"]).split(' ')]
        initials = "".join(initials)
        while True:
            try:
                dirName = os.path.join(THIS_FOLDER, 'data', initials + index)
                os.makedirs(dirName)
                break
            except FileExistsError:
                if index:
                    index = '('+str(int(index[1:-1])+1)+')' # Append 1 to number in brackets
                else:
                    index = '(1)'
                    pass # Go and try create file again

        imgURL = None
        if 'imageFile' in request.files:
            img = request.files['imageFile']
            imgURL = os.path.join(dirName, secure_filename(img.filename))
            img.save(imgURL)

        newSub = submission(
            yourName = request.form["yourName"],
            yourEmail = request.form["yourEmail"],
            modelName = request.form["modelName"],
            description = request.form["description"],
            imageFileURL = imgURL,
            origPaperTitle = request.form["paperTitle"],
            authors = request.form["authors"],
            doi = request.form["doi"],
            year = request.form["year"]
        )

        db.session.add(newSub)
        db.session.commit()

        return redirect('submit.html')

    # comment = Comment(content = request.form["contents"])
    # db.session.add(comment)
    # db.session.commit()

    return render_template('submit.html')


@app.route('/about')
def about():
    return render_template("about.html")


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'submission': submission, 'reference': reference, 'variant': variant, 'result': result}

from models import submission, reference, variant, result