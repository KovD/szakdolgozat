import { useNavigate } from 'react-router-dom';
import './fill.css'
import Header from '../../universal/header/header'

function Fill(){
    const navigate = useNavigate()
    const goToBack = () => {
        navigate('/');
    };

    return <div>
    <div id='fill'>
        <p>Please enter the code:</p>
        <input type="text" maxLength='7'/>
        <button id='submit'>Enter</button>
        <button id='back' onClick={goToBack}>Back</button>
    </div>
    </div> 
}

export default Fill