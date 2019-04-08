import React from "react";
import ReactJson from 'react-json-view'
import styled from 'styled-components';

const Panel = styled.div`
 border: solid 1px red;
padding: 10px;

`

const Field = ({data}) => (<div>
    <h2>{data.predicate}</h2>
    {
        <ReactJson src={data} />
    }
</div>)


const ShexForm = ({shexj}) => {
    const { expression } = shexj;
    return <Panel>

        {
            expression ? expression.expressions.map((expr) => {
                if(typeof expr.valueExpr === 'string'){
                    return <ShexForm shexj={expr._formValues[0]} />
                }else{
                    return <Field data={expr}/>
                }
            }) : <ReactJson src={expression} />
        }
    </Panel>
}

export default ShexForm;