export class ShexFormValidator {
    constructor(fields) {
        this.fields = fields;
    }

    errorFieldFactory = (field: Object, error: String) => {
        return {
            ...field,
            error
        };
    }

    formStringValidation = (field) => {
        const { valueExpr } = field;

        if (valueExpr.pattern) {
            const regex = new RegExp(valueExpr.pattern);

            if (!regex.test(field.value)) {
                const message = 'Error: Field value has wrong format';

                return this.errorFieldFactory(field, message);
            }
        }

        if (valueExpr.minlength || valueExpr.maxlength) {
            if ((valueExpr.minlength && valueExpr.minlength > field.value.length) ||
                ( valueExpr.maxlength && valueExpr.maxlength < field.value.length)) {
                const message = `Error: Value should be more than ${valueExpr.minlength} or less than ${valueExpr.maxlength}`;

                return this.errorFieldFactory(field, message);
            }
        }

        if (valueExpr.length && valueExpr.length === field.value.length) {
            const message = `Error: Characters length should be equal than ${valueExpr.length}`;

            return this.errorFieldFactory(field, message);
        }

        return {...field};
    }

    formNumberValidation = (field) => {
        const { valueExpr } = field;

        if (valueExpr) {
            if (valueExpr.mininclusive || valueExpr.maxinclusive) {
                if ((valueExpr.mininclusive && valueExpr.mininclusive > field.value) ||
                    (valueExpr.maxinclusive && valueExpr.maxinclusive < field.value)) {
                    const message = `Error: Min and max number should be  ${valueExpr.mininclusive}, ${valueExpr.maxinclusive}`;

                    return this.errorFieldFactory(this.field, message);
                }
            }

            if (valueExpr.mininclusive || valueExpr.maxinclusive) {
                if ((valueExpr.minexclusive && valueExpr.minexclusive >= field.value) ||
                    (valueExpr.maxexclusive && valueExpr.maxexclusive <= field.value)) {
                    const message = `Error: Min and max value should be  ${valueExpr.minexclusive}, ${valueExpr.maxexclusive}`;

                    return this.errorFieldFactory(field, message);
                }
            }
        }
        return {...field};
    }

    validate = (field: Object) => {
        const formValuesKeys = Object.keys(field || this.fields);
        let isValid = true;

        const updatedFields = formValuesKeys.reduce((acc, field) => {
            const currentField = this.fields[field];

            if (currentField.valueExpr && currentField.valueExpr.datatype.includes('string')) {
                const updatedField = this.formStringValidation(currentField);

                if (updatedField.error) isValid = false;

                return {...acc, [ field]: updatedField };
            }

            const updatedField =  this.formNumberValidation(currentField);

            if (updatedField.error) isValid = false;

            return {...acc, [field]: updatedField };
        }, []);


        return { isValid, updatedFields };
    }
}
