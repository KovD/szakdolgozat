import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import './quiz_palette.css';
import Props from './props/props';
import Questions from './questions/questions';

function QuizPalette() {
    const [seenProps, setSeenProps] = useState(false);
    const [propsValues, setPropsValues] = useState({});
    const location = useLocation();
    const { quizData, code } = location.state || {};
    const [userAnswers, setUserAnswers] = useState([]);


    return (
        <div>
            {quizData ? (
                seenProps ? (
                    <div>
                        <Questions 
                            quizData={quizData} 
                            Vprops={propsValues}
                            code = {code}
                        />
                    </div>
                ) : (
                    <Props 
                        showProps={() => setSeenProps(true)} 
                        quizData={quizData} 
                        setPropsValues={setPropsValues} 
                    />
                )
            ) : (
                <p>Something happened with the programmer's brain.</p>
            )}
        </div>
    );
}

export default QuizPalette;