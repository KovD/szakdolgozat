import './create.css';
import Props from './create_blocks/prop';
import Quest from './create_blocks/question/quest';
import Tag_Slider from './create_blocks/tag_slider/slider';
import {useEffect,useState } from 'react';

function Create() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isSliderVisible, setisSliderVisible] = useState(false);
    const [typeChange, settypeChange] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [signal, setSignal] = useState(false);
    const [dataquestions, setdataQuestions] = useState([]);
    const [tags, setTags] = useState([]);
    const [props, setprops] = useState([]);

    const signalChange = () => {
        const currentDataquestions = [...dataquestions];
        const currentTags = [...tags];
        const currentProps = { ...props };
    
        setSignal(true);
        setTimeout(() => {
            generatePayload(currentDataquestions, currentTags, currentProps);
            setSignal(false);
        }, 0);
    
        setdataQuestions([]);
        setprops([]);
        setTags([]);
    };
    

    const addNewDataQuestion = (title, correctAnswer, wrongAnswers = [], amount) => {
        const newQuestion = {
            title: title,
            correctAnswer: correctAnswer,
            wrongAnswers: wrongAnswers,
            amount: amount
        };
        setdataQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    };

    const fixProps = (title, timer, infinite = false, props = []) => {
        const propsFr = {
            title: title,
            timer: timer,
            infinite: infinite,
            props: props
        };
        setprops(propsFr);
    };

    const generatePayload = (dataquestions, tags, props) => {
        const payload = {
            title: props.title,
            timer: props.timer,
            infinite: props.infinite,
            properties: props.props,
            questions: dataquestions,
            tags: tags
        };
    
        console.log("Generated Payload:", JSON.stringify(payload, null, 2));
    };

    const addNewTag = (id, value = []) => {
        const newTag = {
            id: id,
            value: value
        };
        setTags((prevTags) => [...prevTags, newTag]);
    };

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
        <Tag_Slider signal={signal} tagfunc ={addNewTag} setisSliderVisible={setisSliderVisible} isVisible={isSliderVisible} />
        <div id="row">
            <div id="column_left">
                <Props signal = {signal} fixProps={fixProps} onClose={onClose} isPopupVisible={isPopupVisible} togglePopup={togglePopup} onChange={onChange} />
                <div id="publish">
                    <button className="cont_but">Save</button>
                    <button onClick={() => signalChange()} className="cont_but" >Upload</button>
                </div>
                {isPopupVisible && (
                    <div id="overlay" onClick={onClose}></div>
                )}
            </div>

            <div id="column_right">
                <div id="questions">
                    {questions.map(q => (
                        <Quest
                            id={q.id}
                            Questions={addNewDataQuestion}
                            signal={signal}
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
