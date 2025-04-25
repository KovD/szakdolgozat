import './create.css';
import Props from './create_blocks/prop';
import Quest from './create_blocks/question/quest';
import Tag_Slider from './create_blocks/tag_slider/slider';
import {useMemo, useRef, useEffect,useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';

function Create() {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isSliderVisible, setisSliderVisible] = useState(false);
    const [typeChange, settypeChange] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [isEdit, setIsEdit] = useState(false)
    const location = useLocation();
    const id = location.state?.id;
    const [signal, setSignal] = useState(false);
    const dataquestions = useRef([])
    const tags = useRef([]);
    const Allprops = useRef();

    useEffect(() => {
        if (id && !isEdit) {
            setIsEdit(true);
            
            const fetchData = async () => {
                try {
                    const response = await fetch(`${API_URL}/quiz/GetQuizDetails/${id}`, {
                        method: 'GET',
                    });
                    
                    if (!response.ok) throw new Error('Failed to fetch');
                    
                    const quizDetails = await response.json();
                    
                    const transformedData = {
                        questions: quizDetails.questions.map(q => ({ id: q.id })),
                        dataquestions: quizDetails.questions.map(q => ({
                            id: q.id,
                            title: q.questionText,
                            correctAnswer: q.correctAnswers,
                            wrongAnswers: q.wrongAnswers,
                            amount: q.amount
                        })),
                        AllProps: {
                            title: quizDetails.quizName,
                            timer: quizDetails.timer,
                            infinite: quizDetails.infinite,
                            props: quizDetails.props.map(p => ({
                                title: p.propName,
                                type: p.type
                            }))
                        },
                        tags: quizDetails.tags.map(t => ({
                            id: t.name,
                            TagName: t.name,
                            value: t.value
                        }))
                    };
    
                    setQuestions(transformedData.questions);
                    dataquestions.current = transformedData.dataquestions;
                    Allprops.current = transformedData.AllProps;
                    tags.current = transformedData.tags;
    
                    localStorage.setItem('questions', JSON.stringify(transformedData.questions));
                    localStorage.setItem('dataquestions', JSON.stringify(transformedData.dataquestions));
                    localStorage.setItem('AllProps', JSON.stringify(transformedData.AllProps));
                    localStorage.setItem('tags', JSON.stringify(transformedData.tags));
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            };
            
            fetchData();
        } else {clearQuizLocalStorage()}
    }, [id, isEdit]);

    const clearQuizLocalStorage = () => {
        localStorage.removeItem('questions');
        localStorage.removeItem('dataquestions');
        localStorage.removeItem('AllProps');
        localStorage.removeItem('tags');
      };      

    const askUpload = async () => {
        const message = isEdit
          ? "If you apply these changes, the quiz will be updated."
          : "Are you sure, you want to upload this?";
        
        if (window.confirm(message)) {
          await signalChange();
          await PostData();
        }
    };

    const SaveData = async() => {
        await signalChange();
        localStorage.setItem('questions', JSON.stringify(questions)); 
        localStorage.setItem('dataquestions', JSON.stringify(dataquestions.current));
        localStorage.setItem('AllProps', JSON.stringify(Allprops.current));
        localStorage.setItem('tags', JSON.stringify(tags.current));
    };

    const handleDiscardChanges = () => {
        clearQuizLocalStorage();

        setQuestions([]);
        dataquestions.current = [];
        tags.current = [];
        Allprops.current = {};

        setIsEdit(false);
        navigate('/create', { replace: true, state: {} });
    };

    useEffect(() => {
        const savedQuestions = JSON.parse(localStorage.getItem("questions")) || [];
        const savedDataQuestions = JSON.parse(localStorage.getItem("dataquestions")) || [];
        const savedProps = JSON.parse(localStorage.getItem("AllProps")) || { title: "", timer: 0, infinite: false, props: [] };
        const savedTags = JSON.parse(localStorage.getItem("tags")) || [];
        
        tags.current = savedTags;
        Allprops.current = savedProps;
        setQuestions(savedQuestions);
        dataquestions.current = savedDataQuestions;
    }, []);

    const signalChange = async () => {
        setSignal(true);
        await new Promise(resolve => setTimeout(resolve, 0)); 
        setSignal(false);
        await new Promise(resolve => setTimeout(resolve, 50));
    };

    const PostData = async () => {
        let res;
        if (!Check()) return;
        const requestBody = {
            dataQuestions: dataquestions.current,
            tags: tags.current,
            Allprops: Allprops.current
        };
    
        try {
            if (isEdit) {
                res = await fetch(`${API_URL}/quiz/UpdateQuiz`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({
                        quizID: id,
                        QuizData: requestBody
                    })
                });
            } else {
                res = await fetch(`${API_URL}/quiz/PostQuiz`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify(requestBody),
                });
            }
    
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    
            const successMessage = isEdit
                ? 'Quiz updated successfully!'
                : `Quiz uploaded with code: ${await res.text()}`;
    
            alert(successMessage);
    
            localStorage.removeItem('questions');
            localStorage.removeItem('dataquestions');
            localStorage.removeItem('AllProps');
            localStorage.removeItem('tags');
            clearQuizLocalStorage();
            window.location.reload();
    
        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('401')) {
                alert('You are not authorized. Please log in again.');
                localStorage.removeItem('token');
            } else {
                alert('An error occurred. Please try again.');
            }
        }
    };

    const addNewDataQuestion = (id, title, correctAnswer, wrongAnswers = [], amount) => {
        const existingIndex = dataquestions.current.findIndex(item => item.id === id);
        if (existingIndex !== -1) {
            dataquestions.current = [
                ...dataquestions.current.slice(0, existingIndex),
                { id, title, correctAnswer, wrongAnswers, amount },
                ...dataquestions.current.slice(existingIndex + 1)
            ];
        } else {
            dataquestions.current = [...dataquestions.current, { id, title, correctAnswer, wrongAnswers, amount }];
        }
    };

    const Check = () => {
        if (dataquestions.current.length === 0) {
          alert('Please add at least one question.');
          return false;
        }
      
        for (const q of dataquestions.current) {
          if (!q.title?.trim()) {
            alert('Please fill in the question title for all questions.');
            return false;
          }
          if (!q.correctAnswer?.length) {
            alert('Each question must have at least one correct answer.');
            return false;
          }
          if (!q.wrongAnswers?.length) {
            alert('Each question must have at least one wrong answer.');
            return false;
          }
          const amount = Number(q.amount);
          if (isNaN(amount) || amount <= 0) {
            alert('Each question must have a valid positive amount.');
            return false;
          }
        }
        return true;
      };

    const fixProps = (title, timer, infinite = false, props = []) => {
        Allprops.current = { 
            title: title,
            timer: timer,
            infinite: infinite,
            props: [...props]
        };
    };

    const addNewTag = (id, idName, value = []) => {
        const existingIndex = tags.current.findIndex(tag => tag.id === id);
        if (existingIndex !== -1) {
            tags.current = [
                ...tags.current.slice(0, existingIndex),
                { id, TagName: idName, value },
                ...tags.current.slice(existingIndex + 1)
            ];
        } else {
            tags.current = [...tags.current, { id, TagName: idName, value }];
        }
    };

    const togglePopup = () => setIsPopupVisible(!isPopupVisible);
    const toggleSlider = () => setisSliderVisible(!isSliderVisible);
    const onClose = () => togglePopup();

    const addNewQuestion = () => {
        const newQuestion = { id: Date.now() };
        setQuestions(prev => [...prev, newQuestion]);
    };

    const deleteQuestion = (id) => {
        setQuestions(prev => prev.filter(q => q.id !== id));
        dataquestions.current = dataquestions.current.filter(item => item.id !== id);
    };

    const initialProps = useMemo(() => (
        Allprops.current?.props?.map(p => ({ name: p.title, type: p.type })) || []
    ), [Allprops.current?.props]);

    const initialTimer = useMemo(() => Allprops.current?.timer?.toString() || "", [Allprops.current?.timer]);
    const initialInfinite = useMemo(() => Allprops.current?.infinite || false, [Allprops.current?.infinite]);
    const propTitle = useMemo(() => Allprops.current?.title || "", [Allprops.current?.title]);

    return (
        <div>
            <Tag_Slider 
                signal={signal} 
                tagfunc={addNewTag} 
                setisSliderVisible={setisSliderVisible} 
                isVisible={isSliderVisible}
                initialTags={tags.current} 
            />
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
                        {isEdit && <button className="cont_but" onClick={handleDiscardChanges}>Discard Changes</button>}
                        <button onClick={askUpload} className="cont_but">
                            {isEdit ? "Apply Changes" : "Upload"}
                        </button>
                    </div>
                    {isPopupVisible && <div id="overlay" onClick={onClose}></div>}
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
                    <button id="add-button" title='Add new question' onClick={addNewQuestion}>
                        +
                    </button>
                    <button className='cont_but' onClick={toggleSlider}>Tags</button>
                </div>
            </div>
        </div>
    );
}

export default Create;