import React, { useState } from 'react';
import './quest.css';

const Quest = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState('');

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="collapsible">
      <div
        onClick={toggleCollapse}
        className={`collapsible-header ${isOpen ? 'open' : ''}`}
      >
        <div id="delete_quest" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
          X
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Question"
          className="collapsible-title-input"
          onClick={handleInputClick}
        />
      </div>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <div id="answers">
            <div>
              <label>Correct Answer:</label>
              <textarea
                id="right_quest"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter correct answer"
                className="collapsible-answer-input"
                onClick={handleInputClick}
              />
            </div>
            <div>
              <label>Wrong Answers:</label>
              <textarea
                id="wrong"
                value={wrongAnswers}
                onChange={(e) => setWrongAnswers(e.target.value)}
                placeholder="Enter wrong answers"
                className="collapsible-answer-input"
                onClick={handleInputClick}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quest;
