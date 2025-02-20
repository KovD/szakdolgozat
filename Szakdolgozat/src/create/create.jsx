import './create.css';
import Props from '../create_blocks/prop';
import Quest from '../create_blocks/question/quest';
import { useState } from 'react';

function Create() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [typeChange, settypeChange] = useState(false);
    const [questions, setQuestions] = useState([]); // State to hold the list of questions

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const onClose = () => {
        togglePopup();
    };

    const onChange = (Change) => {
        settypeChange(Change);
    };

    const addNewQuestion = () => {
        setQuestions([...questions, <Quest key={questions.length} />]);
    };

    return (
        <div id="row">
            <div id="column_left">
                <Props onClose={onClose} isPopupVisible={isPopupVisible} togglePopup={togglePopup} onChange={onChange} />
                <div id="publish">
                    <button className="cont_but">Save</button>
                    <button className="cont_but">Upload</button>
                </div>
                {isPopupVisible && (
                    <div id="overlay" onClick={onClose}></div>
                )}
            </div>

            <div id="column_right">
                <div id="questions">
                    {/* Render the list of Quest components */}
                    {questions}
                </div>
                <button className="cont_but" title='Click here to add a new question' onClick={addNewQuestion}>
                    +
                </button>
            </div>
        </div>
    );
}

export default Create;
