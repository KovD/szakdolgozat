import { useState } from 'react';
import FillerDetails from './prop';
import { useNavigate } from 'react-router-dom';

const QuizComponent = ({ quiz, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);

  const nav = useNavigate()

  const modify = () =>{
    nav('/create', {state: {id: quiz.quizID} })
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      await onDelete(quiz.quizID);
    }
  };

  const handleCopyCode = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(quiz.quizCode);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };


  return (
    <div className="quiz-block">
      <div className="quiz-header" onClick={() => setIsOpen(!isOpen)}>
        {quiz.quizName}
        <button 
          id="copy-button" 
          onClick={handleCopyCode}
          title="Copy quiz code"
        >
          📋 {quiz.quizCode}
        </button>
        <button id="edit-button" 
        onClick={()=>modify()}>
            Edit
          </button>
        <button 
          id="delete-button" 
          onClick={handleDelete}
          title="Delete quiz"
        >
          ×
        </button>
        <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div className="fillers-container">
          {quiz.fillers
              ?.slice()
              ?.sort((a, b) => b.score - a.score)
              ?.slice(0, 3)
              ?.map((filler, index) => (
              <FillerDetails
                IsInfinite={quiz.isInfinite}
                key={index}
                filler={filler}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
