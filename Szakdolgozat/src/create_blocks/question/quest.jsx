import React, { useState } from 'react';
import './quest.css';

const Collapsible = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState('');

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="collapsible">
      <div
        onClick={toggleCollapse}
        className={`collapsible-header ${isOpen ? 'open' : ''}`}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="collapsible-title-input"
        />
      </div>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <div>
            <div>
              <label>Correct Answer:</label>
              <input
                type="text"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                placeholder="Enter correct answer"
                className="collapsible-answer-input"
              />
            </div>
            <div>
              <label>Wrong Answers:</label>
              <input
                type="text"
                id="wrong"
                value={wrongAnswers}
                onChange={(e) => setWrongAnswers(e.target.value)}
                placeholder="Enter wrong answers"
                className="collapsible-answer-input"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collapsible;
