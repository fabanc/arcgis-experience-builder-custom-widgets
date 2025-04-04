
/** @jsx jsx */
import { Display } from 'dist/widgets/lrs/dynamic-segmentation/src/runtime/components/actions/display'
import { React, css, jsx } from 'jimu-core'
import { CopyButton } from 'jimu-ui/basic/copy-button'
const { useEffect, useRef } = React

interface CopyRowProps {
    label: string
    copyableText: string
}

const CopyRow = (props: CopyRowProps) => {
    const hide = (!props.copyableText || props.copyableText.length === 0 )
    return (    
    <div className='coordinates-widget-container m-2 d-flex justify-content-between surface-1' style={{display: hide ? 'none' : 'block', visibility: hide ? 'hidden' : 'visible'}}>
        <CopyButton
            text={props.copyableText}
            disabled={!props.copyableText}
        />
        <div className='coordinates-info text-truncate' title={props.copyableText}>
            {props.label}: {props.copyableText}
        </div>
    </div>
    )
}

export default CopyRow