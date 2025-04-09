
/** @jsx jsx */

import { React, css, jsx } from 'jimu-core'
import { style } from '../../../../../../dist/widgets/common/list/src/setting/setting';

interface LabelRowProps {
    label: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const checkboxId = crypto.randomUUID()
const LabelRow = (props: LabelRowProps) => {
    return (    
    <div className='coordinates-widget-container m-2 d-flex justify-content-between surface-1'>
        <input type="checkbox"id={checkboxId} checked={props.checked} onChange={props.onChange} style={{marginLeft:"0.5em"}}/>
        <div className='coordinates-info text-truncate'>
            <label htmlFor={checkboxId}> {props.label}</label>
        </div>
    </div>
    )
}

export default LabelRow