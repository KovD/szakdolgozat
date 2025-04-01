import React, { useEffect, useState } from 'react';
import './quest.css';

const Quest = ({ id, Questions, signal, onDelete, initialTitle, initialCorrectAnswer, initialWrongAnswers, initialAmount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle || '');
  const [correctAnswer, setCorrectAnswer] = useState(initialCorrectAnswer || '');
  const [wrongAnswers, setWrongAnswers] = useState(initialWrongAnswers || '');
  const [amount, setAmount] = useState(initialAmount || '');
  
  useEffect(() => {
    if(signal) {
      const answersArray = wrongAnswers.split('\n').filter(a => a.trim() !== '');
      const correcAnswersArray = correctAnswer.split('\n').filter(a => a.trim() !== '');
      const processedData = {
        id: id,
        title: title.trim(),
        correctAnswer: correcAnswersArray,
        wrongAnswers: answersArray,
        amount: parseInt(amount) || 0
      };
      
      Questions(
        processedData.id,
        processedData.title, 
        processedData.correctAnswer,
        processedData.wrongAnswers,
        processedData.amount
      );
    }
  }, [signal, title, correctAnswer, wrongAnswers, amount, id, Questions]);

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
                placeholder="Enter correct answer (one per line)"
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
                placeholder="Enter wrong answers (one per line)"
                className="collapsible-answer-input"
                onClick={handleInputClick}
              />
            </div>
            <div>
              <label>Amount of answers:</label>
              <input 
                id="amount"
                min={0}
                max={10}
                type='number'
                value={amount}
                onChange={(e) => {
                  const value = Math.max(0, Math.min(10, Number(e.target.value)));
                  setAmount(value);
                }}
                placeholder='Enter how many answers'
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