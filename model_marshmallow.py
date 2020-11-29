from models import submission, reference, variant, result
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from marshmallow_sqlalchemy.fields import Nested

class reference_schema(SQLAlchemyAutoSchema):

    class Meta:
        model = reference
        include_relationship = True
        load_instance = True
        include_fk = True

class result_schema(SQLAlchemyAutoSchema):

    class Meta:
        model = result
        include_relationship = True
        load_instance = True
        include_fk = True

class variant_schema(SQLAlchemyAutoSchema):

    class Meta:
        model = variant
        include_relationship = True
        load_instance = True
        include_fk = True
    # my_submission = auto_field()
    result = Nested(result_schema, many=True, exclude=("var",))

class submission_schema(SQLAlchemyAutoSchema):

    class Meta:
        model = submission
        include_relationship = True
        load_instance = True

    ref = Nested(reference_schema, many=True, exclude=("sub",))
    variant = Nested(variant_schema, many=True, exclude=("sub",))