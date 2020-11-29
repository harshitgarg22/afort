from models import submission, reference, variant, result, db
from model_marshmallow import submission_schema, reference_schema, variant_schema, result_schema
from flask import Flask, render_template, request, redirect, flash, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
from config import MYSQL_PASS
from dftparser import parse_file

import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn="https://c133dd1d51f1465e81acff14a44f59f1@o391718.ingest.sentry.io/5536877",
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)

THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__)
app.secret_key = b'12345678'
app.config['SESSION_TYPE'] = 'filesystem'
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

db.init_app(app)
migrate = Migrate(app, db)


@app.route('/', methods=["GET"])
def index():
    list_submissions = []
    list_submissions = submission.query.all()

    BEList = []
    gateList = []
    list_submissions_json = []

    for sub in list_submissions:
        for var in sub.variant:
            (gateList, BEList) = parse_file(
                os.path.join(THIS_FOLDER, 'data', var.dftFileURL))

        list_submissions_json.append(submission_schema().dump(sub))

    return render_template('index.html', list_submissions=list_submissions_json, gateList=gateList, BEList=BEList)


@app.route('/stats', methods=["GET"])
def stats():
    list_submissions = []
    list_submissions = submission.query.all()

    BEList = []
    gateList = []
    list_submissions_json = []

    for sub in list_submissions:
        for var in sub.variant:
            (gateList, BEList) = parse_file(
                os.path.join(THIS_FOLDER, 'data', var.dftFileURL))

        list_submissions_json.append(submission_schema().dump(sub))

    return render_template("stats.html", list_submissions=list_submissions, gateList=gateList, BEList=BEList)


jsonData = []
# This is a makeshift way to send both AJAX and HTML form data. Should be fixed in a future release to a more neater/elegant implementation.


@app.route('/submitAJAX', methods=["POST"])
def get_res():
    global jsonData
    jsonData = request.json


@app.route('/submit', methods=["GET", "POST"])
def submit():

    if request.method == "POST":

        resVarList = []

        for eachVar in jsonData:
            del eachVar['elementDiv']
            del eachVar['varNum']
            resVarList.append(len(eachVar['results']))

        # create directory for this model with name as initials of model name
        index = ''
        initials = [word[0]
                    for word in str(request.form["modelName"]).split(' ')]
        initials = ("".join(initials)).lower()
        while True:
            try:
                dirName = os.path.join(THIS_FOLDER, 'data', initials + index)
                os.makedirs(dirName)
                break
            except FileExistsError:
                if index:
                    # Append 1 to number in brackets
                    index = '('+str(int(index[1:-1])+1)+')'
                else:
                    index = '(1)'
                    pass  # Go and try create file again

        # Save image for the submission
        imgURL = None
        if request.files['imageFile']:
            img = request.files['imageFile']
            imgURL = os.path.join(dirName, secure_filename(img.filename))
            img.save(imgURL)

            # Save the path relative to /data/
            imgURL = os.path.join(
                initials + index, secure_filename(img.filename))

        # Save the dft file for each submission
        dftURL = []

        print(request.form.getlist('variantName'))
        for eachDFT in request.files.getlist("dftFile"):
            saveFile = (os.path.join(
                dirName, secure_filename(eachDFT.filename)))
            eachDFT.save(saveFile)

            # Save the path relative to /data/
            dftURL.append(os.path.join(initials + index,
                                       secure_filename(eachDFT.filename)))

        newSub = submission(
            yourName=request.form["yourName"],
            yourEmail=request.form["yourEmail"],
            modelName=request.form["modelName"],
            description=request.form["description"],
            imageFileURL=imgURL,
            origPaperTitle=request.form["paperTitle"],
            authors=request.form["authors"],
            doi=request.form["doi"],
            year=request.form["year"]
        )

        if "refTitle" in request.form:
            newRef = reference(
                refTitle=request.form["refTitle"],
                refAuthors=request.form["refAuthors"],
                refDoi=request.form["refDoi"],
                refYear=request.form["refYear"]
            )
            newSub.ref = newRef
            db.session.add(newRef)

        newVar = []

        for i in range(len(dftURL)):
            newVar.append(variant(
                dftFileURL=dftURL[i],
                varName=request.form.getlist('variantName')[i],
                varDescription=request.form.getlist('variantDescription')[i],
                varTitle=request.form.getlist('variantOrigTitle')[i],
                varAuthors=request.form.getlist('variantAuthor')[i],
                varDoi=request.form.getlist('variantDOI')[i],
                varYear=request.form.getlist('variantYear')[i]
            ))

        if "resType" in request.form:
            newRes = result(
                type=request.form['resType'],
                value=request.form['resValue'],
                time=request.form['resTime'],
                tool=request.form['resTool'],
                resultTitle=request.form['resOPT'],
                resultAuthors=request.form['resAuth'],
                resultDoi=request.form['resDoi'],
                resYear=request.form['resYear'],
                resultComment=request.form['resComments']
            )
            db.session.add(newRes)

            # Add results to every Variant separately
            offset = 0
            for eachVar, resCount in zip(newVar, resVarList):
                eachVar.results = newRes[offset: offset + resCount]
                offset += resCount

        # Add variant objects to submission
        newSub.variant = newVar

        for eachVar in newVar:
            db.session.add(eachVar)

        db.session.add(newSub)
        db.session.commit()

        flash('Your entry has been successfully recorded!', 'info')

        return redirect(url_for('submit'))

    return render_template('submit.html')


@app.route('/about')
def about():
    return render_template("about.html")


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'submission': submission, 'reference': reference, 'variant': variant, 'result': result}


@app.route('/debug-sentry')
def trigger_error():
    division_by_zero = 1 / 0
