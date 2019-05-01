import React from 'react';


export const InputField = (...props) => {
    return (
        <input
            type="text"
            value={inputData.value}
            name={inputData.name}
            onChange={onChange}
            data-predicate={predicate}
            data-subject={subject}
            data-default={defaultValue}
            data-prefix={hasPrefix}
            data-parent-predicate={
                parent && parent.predicate ? parent.predicate : null
            }
            data-valuexpr={JSON.stringify(data.valueExpr)}
            data-parent-subject={
                parent && parent._formValues[0]._formFocus.parentSubject
            }
        />
    );
};
