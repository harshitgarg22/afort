from flask import Flask, render_template, request, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
from mysql_pass import MYSQL_PASS
from dftparser import parse_file

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

    return render_template('index.html')


@app.route('/stats', methods = ["GET"])
def stats():
    # return render_template("stats.html", comments_disp = Comment.query.all())
    return render_template("stats.html")

jsonData = []
# This is a makeshift way to send both AJAX and HTML form data. Should be fixed in a future release to a more neater/elegant implementation.
@app.route('/submitAJAX', methods = ["POST"])
def get_res():
    global jsonData
    jsonData = request.json

@app.route('/submit', methods = ["GET", "POST"])
def submit():

    if request.method == "POST":
        # formData = request.form.to_dict(flat=False)

        resVarList = []

        for eachVar in jsonData:
            del eachVar['elementDiv']
            del eachVar['varNum']
            resVarList.append(len(eachVar['results']))

        print(resVarList)

        # create directory for this model with name as initials of model name
        index = ''
        initials = [word[0] for word in str(request.form["modelName"]).split(' ')]
        initials = ("".join(initials)).lower()
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

        # Save image for the submission
        imgURL = None
        if 'imageFile' in request.files:
            img = request.files['imageFile']
            imgURL = os.path.join(dirName, secure_filename(img.filename))
            img.save(imgURL)

        # Save the dft file for each submission
        dftURL = []

        for eachDFT in request.files["dftFile"]:
            dftURL.append(os.path.join(dirName, secure_filename(eachDFT.filename)))
            eachDFT.save(dftURL)

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

        newRef = reference(
            refTitle = request.form["refTitle"],
            refAuthors = request.form["refAuthors"],
            refDoi = request.form["refDoi"],
            refYear = request.form["refYear"]
        )

        newVar = variant(
            dftFileURL = dftURL,
            varName = request.form['variantName'],
            varDescription = request.form['variantDescription'],
            varTitle = request.form['variantOrigTitle'],
            varAuthors = request.form['variantAuthor'],
            varDoi = request.form['variantDOI'],
            varYear = request.form['variantYear']
        )

        newRes = result(
            type = request.form['resType'],
            value = request.form['resValue'],
            time = request.form['resTime'],
            tool = request.form['resTool'],
            resultTitle = request.form['resOPT'],
            resultAuthors = request.form['resAuth'],
            resultDoi = request.form['resDoi'],
            varYear = request.form['resYear'],
            resultComment = request.form['resComments']
        )

        # Add reference and variant objects to submission
        newSub.ref = newRef
        newSub.var = newVar

        # Add results to every Variant separately
        offset = 0

        for eachVar, resCount in zip(newVar, resVarList):
            eachVar.results = newRes[offset : offset + resCount]
            offset += resCount

        db.session.add(newSub)
        db.session.add(newRef)
        db.session.add(newVar)
        db.session.add(newRes)

        db.session.commit()

        flash('Your entry has been successfully recorded!', 'info')

        return redirect('submit.html')

    return render_template('submit.html')


@app.route('/about')
def about():
    return render_template("about.html")


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'submission': submission, 'reference': reference, 'variant': variant, 'result': result}

from models import submission, reference, variant, result