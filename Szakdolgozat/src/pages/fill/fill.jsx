import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './fill.css'
import Header from '../../universal/header/header'
import QuizPalette from '../quiz/quiz_palette_not_inf.jsx';

function Fill(){

    const [code, setCode] = useState('')
    const changeCode = (e) => {
        setCode(e.target.value)
    }

    const navigate = useNavigate()
    const goToBack = () => {
        navigate('/');
    };

    const submit = async () => {
        console.log(code)
        const response = await fetch(`http://localhost:5000/users/GetQuiz/${code}`, {
            method: 'GET',
        });
    
        if (!response.ok) {
            alert('Invalid code');
        } else {
            const quizData = await response.json();
            navigate('/quiz', { state: { quizData, code } });
        }
    };

    return <div>
    <div id='fill'>
        <p>Please enter the code:</p>
        <input 
        type="text" maxLength='10'
        value={code}
        onChange={changeCode}
        />
        <button id='submit' onClick={submit}>Enter</button>
        <button id='back' onClick={goToBack}>Back</button>
    </div>
    </div> 
}

export default Fill