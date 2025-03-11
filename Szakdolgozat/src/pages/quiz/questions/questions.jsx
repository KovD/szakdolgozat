import { useState, useEffect } from "react";
import InfiniteEndpoints from "../endpoints/infiniteEndpoint";
import Endpoint from "../endpoints/enpoint";
import './questions.css'

function Questions({Vprops, quizData, onComplete, code }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [processedQuestions, setProcessedQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(null);
    const [infiniteScore, setInfiniteScore] = useState(0);
    const [infiniteEnd, setInfiniteEnd] = useState(false);


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

    const IncreaseInfiniteScore = () => {
        setInfiniteScore(infiniteScore + 1);
    }

    const TrimsProcessedQuestions =(index) =>{
        setProcessedQuestions(processedQuestions.slice(index))
    }

    const AppendProcessedQuestions = (TaggedQuestions, index) =>{
        setProcessedQuestions(processedQuestions.push(TaggedQuestions))


    }

    const resetQuiz = async () => {
        const response = await fetch(`http://localhost:5000/users/GetQuizWithID/${quizData.id}`, {
            method: 'GET',
        });
        const newQuizData = await response.json();
        if (!newQuizData.questions) return;
    
        const questionsWithReplacedTags = newQuizData.questions.map((question) => ({
            ...question,
            realAnswers: question.answers.map(answer => ({ ...answer })),
            question: replaceTags(question.question),
            answers: question.answers.map((answer) => ({
                ...answer,
                value: replaceTags(answer.value),
            })),
        }));
        setProcessedQuestions(prev => {
            const appended = [...prev, ...questionsWithReplacedTags];
            const trimmed = appended.slice(currentQuestionIndex);
            return trimmed;
        });
        setCurrentQuestionIndex(1);
        setSelectedAnswers({});
    };

    useEffect(() => {
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
        console.log(Vprops)
    
        if (!quizData.infinite) {
            if (currentQuestionIndex < processedQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                const result = processedQuestions.map(question => ({
                    id: question.id,
                    question: question.question,
                    selected: {
                        index: selectedAnswers[question.id],
                        value: question.realAnswers[selectedAnswers[question.id]]?.value || null
                    }
                }));
    
                const response = await fetch('http://localhost:5000/users/CheckQuiz', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({props: Vprops ,quizId: quizData.id, answers: result }),
                });
    
                if (!response.ok) throw new Error('Hiba a kérésben');
                const percentage = await response.json();
                setScore(percentage);
            }
        } else {
            const result = [{
                id: currentQuestion.id,
                question: currentQuestion.question,
                selected: {
                    index: selectedAnswers[currentQuestion.id],
                    value: currentQuestion.realAnswers[selectedAnswers[currentQuestion.id]]?.value || null
                }
            }];
    
            const response = await fetch('http://localhost:5000/users/CheckQuiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({infinite: true, quizId: quizData.id, answers: result }),
            });
    
            const percentage = await response.json();
            if (percentage <= 0){
                setInfiniteEnd(true);
            } else {
                IncreaseInfiniteScore();
            };
    
            if (currentQuestionIndex < processedQuestions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                await resetQuiz();
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
          <div className="quiz-header">
            {quizData.infinite ? `Score: ${infiniteScore}` : quizData.title}
          </div>
          
          <form onSubmit={handleSubmit} className="quiz-form">
            <h3 className="question-text">{currentQuestion.question}</h3>
            
            {currentQuestion.answers.map((answer, index) => (
              <label 
                key={index}
                className="answer-option"
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