import React from "react";
import { Field } from './children';
import styled from 'styled-components';

const Panel = styled.div`
 border: solid 1px red;
padding: 10px;

`

const ShexForm = ({shexj, parent = null}) => {
    const { expression } = shexj;
    return <Panel>
        {parent && parent.predicate && <h4>{parent.predicate.split("#has")[1]}</h4>}
        {
            expression && expression.expressions.map((expression) => {
                if(typeof expression.valueExpr === 'string'){
                    return expression._formValues.map((shexj,i) => <ShexForm key={i} shexj={shexj} parent={shexj._formFocus} /> )
                }else{
                    return <Field data={expression}/>
                }
            })
        }
    </Panel>
}

export default ShexForm;