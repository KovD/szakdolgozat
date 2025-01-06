import './universal.css'

function TxtButton(inputs){

    return <div id="txtButtons" onClick = {inputs.onClick} className={inputs.className}>
        {inputs.text}
    </div>

}

export default TxtButton