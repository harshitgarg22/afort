from flask_app import db

class submission(db.Model):

    __tablename__ = "submission"

    id = db.Column(db.Integer, primary_key = True)
    yourName = db.Column(db.String(256))
    yourEmail = db.Column(db.String(128))
    modelName = db.Column(db.String(256))
    description = db.Column(db.String(1024))
    imageFileURL = db.Column(db.String(256))
    origPaperTitle = db.Column(db.String(256))
    authors = db.Column(db.String(2048))
    doi = db.Column(db.String(256))
    year = db.Column(db.Integer)

    ref = db.relationship('reference', backref = 'my_submission', lazy = 'dynamic')
    variant = db.relationship('variant', backref = 'my_submission', lazy = 'dynamic')

class reference(db.Model):

    __tablename__ = "reference"

    refId = db.Column(db.Integer, primary_key = True)
    refTitle = db.Column(db.String(256))
    refAuthors = db.Column(db.String(2048))
    refDoi = db.Column(db.String(256))
    refYear = db.Column(db.Integer)

class variant(db.Model):

    __tablename__ = "variant"

    varId = db.Column(db.Integer, primary_key = True)
    dftFileURL = db.Column(db.String(256))
    varName = db.Column(db.String(256))
    varDescription = db.Column(db.String(2048))
    varTitle = db.Column(db.String(256))
    varAuthors = db.Column(db.String(2048))
    varDoi = db.Column(db.String(256))
    varYear = db.Column(db.Integer)

    results = db.relationship('result', backref = 'my_variant', lazy = 'dynamic')

class result(db.Model):

    __tablename__ = "result"

    resId = db.Column(db.Integer, primary_key = True)
    type = db.Column(db.String(256))
    value = db.Column(db.String(256))
    time = db.Column(db.String(128))
    tool = db.Column(db.String(256))
    resultTitle = db.Column(db.String(256))
    resultAuthors = db.Column(db.String(2048))
    resultDoi = db.Column(db.String(256))
    varYear = db.Column(db.Integer)
    resultComment = db.Column(db.String(2048))