import { useState } from 'react';
import FillerDetails from './prop';

const QuizComponent = ({ quiz}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchItem, setSearchItem] = useState('')

  return (
    <div className="quiz-block">
      <div 
        className="quiz-header" 
        onClick={() => setIsOpen(!isOpen)}
      >

        {quiz.quizName}
        ({quiz.quizCode})
        <span className="toggle-icon">{isOpen ? '▼' : '▶'}</span>
      </div>
      
      {isOpen && (
        <div className="fillers-container">
          {quiz.fillers?.map((filler, index) => (
            <FillerDetails 
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