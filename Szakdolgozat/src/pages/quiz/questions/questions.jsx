import { useState, useEffect } from "react";
import InfiniteEndpoints from "../endpoints/infiniteEndpoint";
import Endpoint from "../endpoints/enpoint";
import './questions.css'

function Questions({Vprops, quizData, fillerID}) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [processedQuestions, setProcessedQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [infiniteScore, setInfiniteScore] = useState(0);
    const [infiniteEnd, setInfiniteEnd] = useState(false);
    const [isTimer, setIsTimer] = useState(true);
    const [timer, setTimer] = useState(quizData.timer)

    const EndQuiz = async (result) => {
        const payload = JSON.stringify({
          infinite: quizData.infinite,
          FillerID: fillerID,
          quizId: quizData.id,
          answers: result
        });
        
        const response = await fetch(`${API_URL}/users/CheckQuiz`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
        });
        
        if (!response.ok) throw new Error('Hiba a kérésben');
        return await response.json();
      };

    const replaceTags = (text) => {
        const replacements = {};
        return text.replace(/\$([^$]+)\$/g, (_, tagId) => {
            if (!replacements[tagId]) {
                const tag = quizData.tags.find(t => t.id === tagId);
                const options = tag?.value.split(",").map(s => s.trim());
                replacements[tagId] = options?.[Math.floor(Math.random() * options.length)];
            }
            return replacements[tagId];
        });
    };

    useEffect(() => {
        if(isTimer){
            const interval = setInterval(async () => {
                const time = new Date();
                const response = await fetch(`${API_URL}/users/GetTime`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({currentTime: time, fillerID: fillerID, quizID: quizData.id }),
                });
                const data = await response.json();
                setTimer(data.timer - data.elapsedMinsBack)
                if (data.elapsedMinsBack >= data.timer) {
                    clearInterval(interval);
                    const result = processedQuestions.map(question => ({
                        id: question.id,
                        question: question.question,
                        selected: {
                            index: selectedAnswers[question.id],
                            value: question.realAnswers[selectedAnswers[question.id]]?.value || "not f1lled Question"
                        }}))
                        const res = await EndQuiz(result);
                        if (quizData.infinite) {
                            if (res.percentage <= 0) setInfiniteEnd(true);
                        } else {
                            setScore(res.percentage);
                        }

                }
            }, 60000);
            return () => clearInterval(interval);
        }
    }, [quizData.timer, quizData.id, fillerID]);

    useEffect(() => {
        if(!quizData.timer > 0){
            setIsTimer(false)
        }
        if (!quizData.questions) return;

        const questionsWithReplacedTags = quizData.questions.map((question) => ({
            ...question,
            realAnswers: question.answers.map(answer => ({ ...answer })),
            question: replaceTags(question.question),
            answers: question.answers.map((answer) => ({
                ...answer,
                value: replaceTags(answer.value),
            })),
        }));
        setProcessedQuestions(questionsWithReplacedTags);
    }, [quizData]);

    const resetQuiz = async() => {

        const response = await fetch(`${API_URL}/quiz/GetQuizWithID/${quizData.id}`)
        const newquizData = await response.json();

        const newQuestions = newquizData.questions.map(question => ({
          ...question,
          realAnswers: question.answers.map(a => ({...a})),
          question: replaceTags(question.question),
          answers: question.answers.map(answer => ({
            ...answer,
            value: replaceTags(answer.value)
          }))
        }));
        
        setProcessedQuestions(newQuestions);
        setCurrentQuestionIndex(0);
        setSelectedAnswers({});
      };

    const handleAnswerSelect = (questionId, answerIndex) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: answerIndex
        }));
    };

    if (!quizData || processedQuestions.length === 0) {
        return <div>Töltés...</div>;
    }

    
    const currentQuestion = processedQuestions[currentQuestionIndex];
    const isAnswerSelected = selectedAnswers[currentQuestion.id] !== undefined;

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (quizData.infinite) {
          // Küldd el csak az aktuális választ
          const result = [{
              id: currentQuestion.id,
              question: currentQuestion.question,
              selected: {
                  index: selectedAnswers[currentQuestion.id],
                  value: currentQuestion.realAnswers[selectedAnswers[currentQuestion.id]]?.value || null
              }
          }];
  
          const response = await EndQuiz(result);
  
          if (response.percentage <= 0) {
              setInfiniteEnd(true);
          } else {
              setInfiniteScore(response.points);
          }
  
          if (currentQuestionIndex < processedQuestions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
          } else {
              await resetQuiz();
          }
  
      } else {
          // CSAK a végén küldd el az összes választ
          if (currentQuestionIndex < processedQuestions.length - 1) {
              setCurrentQuestionIndex(prev => prev + 1);
          } else {
              const result = processedQuestions.map(q => ({
                  id: q.id,
                  question: q.question,
                  selected: {
                      index: selectedAnswers[q.id],
                      value: q.realAnswers[selectedAnswers[q.id]]?.value || "not filled"
                  }
              }));
              const response = await EndQuiz(result);
              setScore(response.percentage);
          }
      }
  };

    if (score !== null) {
        return (
            <Endpoint score = {score}/>
        );
    }

    if (infiniteEnd) {
        return (
            <InfiniteEndpoints infiniteScore={infiniteScore}></InfiniteEndpoints>
        );
    }

    const handleContextMenu = (e) => {
        e.preventDefault();
      };
    
      const handleCopy = (e) => {
        e.preventDefault();
      };

      return (
        <div 
          className="quiz-container copy-protection"
          onContextMenu={handleContextMenu}
          onCopy={handleCopy}
        >
            {isTimer ? <div id="timer-container">⏳ {timer} min</div>:null}
            <div className="quiz-header">
                {quizData.infinite ? `Score: ${infiniteScore}` : quizData.title}
            </div>
    
          <form onSubmit={handleSubmit} className="quiz-form">
            <h3 className="question-text">{currentQuestion.question}</h3>
    
            <div className="answer-options-container">
              {currentQuestion.answers.map((answer, index) => (
                <label
                  key={index}
                  className={`answer-option ${selectedAnswers[currentQuestion.id] === index ? "selected" : ""}`}
                  htmlFor={`q${currentQuestion.id}_a${index}`}
                >
                  <input
                    type="radio"
                    id={`q${currentQuestion.id}_a${index}`}
                    name={`question_${currentQuestion.id}`}
                    value={index}
                    checked={selectedAnswers[currentQuestion.id] === index}
                    onChange={() => handleAnswerSelect(currentQuestion.id, index)}
                  />
                  {answer.value}
                </label>
              ))}
            </div>
    
            <button 
              type="submit" 
              className="quiz-button"
              disabled={!isAnswerSelected}
            >
              {currentQuestionIndex === processedQuestions.length - 1 && !quizData.infinite
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </form>
        </div>
    );
    
    
}

export default Questions;