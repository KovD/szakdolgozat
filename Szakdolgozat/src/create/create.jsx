import './create.css';
import Props from './create_blocks/prop';
import Quest from './create_blocks/question/quest';
import Tag_Slider from './create_blocks/tag_slider/slider';
import {useMemo, useRef, useEffect,useState } from 'react';

function Create() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isSliderVisible, setisSliderVisible] = useState(false);
    const [typeChange, settypeChange] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [signal, setSignal] = useState(false);
    const dataquestions = useRef([])
    const tags = useRef([]);
    const Allprops = useRef();

    const askUpload =async() =>{
        if(window.confirm('If you decide to upload this. You won\'t be able to edit it later.'))
        {
            await signalChange()
            await PostData()
        }
    }

    const SaveData = async() => {
        await signalChange()
        localStorage.setItem('questions', JSON.stringify(questions)); 
        localStorage.setItem('dataquestions', JSON.stringify(dataquestions.current));
        localStorage.setItem('AllProps', JSON.stringify(Allprops.current))
        localStorage.setItem('tags', JSON.stringify(tags.current))
    };

    useEffect(() => {
        const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
        const savedDataQuestions = JSON.parse(localStorage.getItem("dataquestions")) || [];
        const savedProps = JSON.parse(localStorage.getItem("AllProps")) || {};
        const savedTags = JSON.parse(localStorage.getItem("tags")) || [];
        tags.current = savedTags
        Allprops.current = savedProps;
        setQuestions(savedQuestions);
        dataquestions.current = savedDataQuestions;
    }, []);

    const signalChange = async () => {
        dataquestions.current = [];
        tags.current = [];
        Allprops.current = [];
        setSignal(true);
        await new Promise(resolve => setTimeout(resolve, 0)); 
        setSignal(false);
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    const PostData = async() =>{
        console.log(tags)
        const res = await fetch(`${API_URL}/users/PostQuiz`, {
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
            localStorage.removeItem('questions');
            localStorage.removeItem('dataquestions');
            localStorage.removeItem('AllProps')
            localStorage.removeItem('tags')
            localStorage.removeItem('TagComponents')
            window.location.reload()
        }
    }

    const addNewDataQuestion = (id, title, correctAnswer, wrongAnswers = [], amount) => {
        dataquestions.current.push({
            id: id,
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

    const addNewTag = (id, idName, value = []) => {
        tags.current.push({
            id: id,
            TagName: idName,
            value: value});
    };

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const toggleSlider = () => {
        setisSliderVisible(!isSliderVisible);
    };

    const onClose = () => {
        togglePopup();
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

    const initialProps = useMemo(() => {
        return Allprops.current?.props
          ? Allprops.current.props.map((p) => ({
              name: p.title,
              type: p.type,
            }))
          : [];
      }, [Allprops.current?.props]);
      
      const initialTimer = useMemo(() => Allprops.current?.timer?.toString() || "", [Allprops.current?.timer]);
      const initialInfinite = useMemo(() => Allprops.current?.infinite || false, [Allprops.current?.infinite]);
      const propTitle = useMemo(() => Allprops.current?.title || "", [Allprops.current?.title]);

    return (
        <div>
            <Tag_Slider signal={signal} 
            tagfunc={addNewTag} 
            setisSliderVisible={setisSliderVisible} 
            isVisible={isSliderVisible}
            initialTags = {tags.current} />
            <div id="row">
                <div id="column_left">
                <Props
                signal={signal}
                fixProps={fixProps}
                onClose={onClose}
                isPopupVisible={isPopupVisible}
                togglePopup={togglePopup}
                PropTitle={propTitle}
                initialTimer={initialTimer}
                initialInfinite={initialInfinite}
                initialProps={initialProps}
                />
                    <div id="publish">
                        <button className="cont_but" onClick={SaveData}>Save</button>
                        <button onClick={() => askUpload()} className="cont_but" >Upload</button>
                    </div>
                    {isPopupVisible && (
                        <div id="overlay" onClick={onClose}></div>
                    )}
                </div>

                <div id="column_right">
                    <div id="questions">
                        {questions.map(q => {
                            const initialData = dataquestions.current.find(dq => dq.id === q.id);
                            return (
                                <Quest
                                    key={q.id}
                                    id={q.id}
                                    initialTitle={initialData?.title || ''}
                                    initialCorrectAnswer={initialData?.correctAnswer?.join('\n') || ''}
                                    initialWrongAnswers={initialData?.wrongAnswers?.join('\n') || ''}
                                    initialAmount={initialData?.amount?.toString() || ''}
                                    Questions={addNewDataQuestion}
                                    signal={signal}
                                    onDelete={() => deleteQuestion(q.id)}
                                />
                            );
                        })}
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