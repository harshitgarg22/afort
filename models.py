from flask_app import db
import datetime

class submission(db.Model):

    __tablename__ = "submission"

    id = db.Column(db.Integer, primary_key = True)
    yourName = db.Column(db.String(256), nullable=False)
    yourEmail = db.Column(db.String(128), nullable=False)
    modelName = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(1024))
    imageFileURL = db.Column(db.String(256))
    origPaperTitle = db.Column(db.String(256), nullable=False)
    authors = db.Column(db.String(2048), nullable=False)
    doi = db.Column(db.String(256), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    dateAdded = db.Column(db.Date, default=datetime.datetime.utcnow)

    ref = db.relationship('reference', backref = 'my_submission', lazy = 'dynamic', cascade='all')
    variant = db.relationship('variant', backref = 'my_submission', lazy = 'dynamic', cascade='all')

class reference(db.Model):

    __tablename__ = "reference"

    refId = db.Column(db.Integer, primary_key = True)
    refTitle = db.Column(db.String(256), nullable=False)
    refAuthors = db.Column(db.String(2048), nullable=False)
    refDoi = db.Column(db.String(256), nullable=False)
    refYear = db.Column(db.Integer, nullable=False)

    sub = db.Column(db.Integer, db.ForeignKey("submission.id"))

class variant(db.Model):

    __tablename__ = "variant"

    varId = db.Column(db.Integer, primary_key = True)
    dftFileURL = db.Column(db.String(256), nullable=False)
    varName = db.Column(db.String(256), nullable=False)
    varDescription = db.Column(db.String(2048))
    varTitle = db.Column(db.String(256), nullable=False)
    varAuthors = db.Column(db.String(2048), nullable=False)
    varDoi = db.Column(db.String(256), nullable=False)
    varYear = db.Column(db.Integer, nullable=False)

    sub = db.Column(db.Integer, db.ForeignKey("submission.id"))
    results = db.relationship('result', backref = 'my_variant', lazy = 'dynamic', cascade='all')

class result(db.Model):

    __tablename__ = "result"

    resId = db.Column(db.Integer, primary_key = True)
    type = db.Column(db.String(256), nullable=False)
    value = db.Column(db.String(256), nullable=False)
    time = db.Column(db.String(128), nullable=False)
    tool = db.Column(db.String(256), nullable=False)
    resultTitle = db.Column(db.String(256), nullable=False)
    resultAuthors = db.Column(db.String(2048), nullable=False)
    resultDoi = db.Column(db.String(256), nullable=False)
    resYear = db.Column(db.Integer, nullable=False)
    resultComment = db.Column(db.String(2048))

    var = db.Column(db.Integer, db.ForeignKey("variant.varId"))