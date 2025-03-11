import './create.css';
import Props from './create_blocks/prop';
import Quest from './create_blocks/question/quest';
import Tag_Slider from './create_blocks/tag_slider/slider';
import {useRef, useEffect,useState } from 'react';

function Create() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isSliderVisible, setisSliderVisible] = useState(false);
    const [typeChange, settypeChange] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [signal, setSignal] = useState(false);
    const dataquestions = useRef([])
    const tags = useRef([]);
    const Allprops = useRef();

    const signalChange = async () => {
        dataquestions.current = [];
        tags.current = [];
        Allprops.current = [];
        setSignal(true);
        await new Promise(resolve => setTimeout(resolve, 0)); 
        setSignal(false);
        await new Promise(resolve => setTimeout(resolve, 50));

        const res = await fetch('http://localhost:5000/users/PostQuiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(
                {
                    dataQuestions: dataquestions.current,
                    tags: tags.current,
                    Allprops: Allprops.current
                }
            ),
        });

        if (res.status === 400) {
            alert('Something isn\'t filled');
        } else if (res.status === 401) {
            alert('You are not authorized');
            localStorage.removeItem('token');
        }else{
            const data = await res.text();
            alert(`Quiz uploaded with code: ${data}`);
            window.location.reload()
        }

    }

    

    const addNewDataQuestion = (title, correctAnswer, wrongAnswers = [], amount) => {
    dataquestions.current.push({
        title: title,
        correctAnswer: correctAnswer,
        wrongAnswers: wrongAnswers,
        amount: amount
    });
    };

    const fixProps = (title, timer, infinite = false, props = []) => {
        Allprops.current= {
            title: title,
            timer: timer,
            infinite: infinite,
            props: props};
    };

    const addNewTag = (id, value = []) => {
        tags.current.push({
            id: id,
            value: value});
    };

    useEffect(() => {
        const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
        setQuestions(savedQuestions);
    }, []);

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
