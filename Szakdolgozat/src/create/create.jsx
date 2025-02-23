import './create.css';
import Props from './create_blocks/prop';
import Quest from './create_blocks/question/quest';
import Tag_Slider from './create_blocks/tag_slider/slider';
import { useState, useEffect } from 'react';

function Create() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isSliderVisible, setisSliderVisible] = useState(false);
    const [typeChange, settypeChange] = useState(false);
    const [questions, setQuestions] = useState([]);


    useEffect(() => {
        const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
        setQuestions(savedQuestions);
    }, []);

    useEffect(() => {
        localStorage.setItem("questions", JSON.stringify(questions));
    }, [questions]);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const toggleSlider = () => {
        setisSliderVisible(!isSliderVisible);
    };

    const onClose = () => {
        togglePopup();
    };

    const onChange = (Change) => {
        settypeChange(Change);
    };

    const addNewQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            title: '',
            correctAnswer: '',
            wrongAnswers: ''
        };
        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

    const deleteQuestion = (id) => {
        setQuestions((prevQuestions) => prevQuestions.filter(q => q.id !== id));
    };

    const updateQuestion = (id, field, value) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map(q => q.id === id ? { ...q, [field]: value } : q)
        );
    };

    return (
    <div>
        <Tag_Slider setisSliderVisible={setisSliderVisible} isVisible={isSliderVisible} />
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
                    {questions.map(q => (
                        <Quest
                            key={q.id}
                            id={q.id}
                            title={q.title}
                            correctAnswer={q.correctAnswer}
                            wrongAnswers={q.wrongAnswers}
                            onDelete={() => deleteQuestion(q.id)}
                            onUpdate={updateQuestion}
                        />
                    ))}
                </div>
                <button className="cont_but" title='Click here to add a new question' onClick={addNewQuestion}>
                    +
                </button>

                <button className='cont_but' onClick={() => toggleSlider()}>Tags</button>
            </div>
        </div>
        </div>
    );
}

export default Create;
