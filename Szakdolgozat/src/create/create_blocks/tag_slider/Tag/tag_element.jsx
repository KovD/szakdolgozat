import React, { useState } from 'react';
import '../../question/quest.css';

const TagElement = ({ onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [ID, setID] = useState('');
  const [Value, setValue] = useState('');

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
          value={ID}
          onChange={(e) => setID(e.target.value)}
          placeholder="ID"
          className="collapsible-title-input"
          onClick={handleInputClick}
        />
      </div>
      <div className={`collapsible-content ${isOpen ? 'open' : ''}`}>
        {isOpen && (
          <div id="answers">
            <div>
              <label>Tag value:</label>
              <textarea
                id="right_quest"
                value={Value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter tag values seperated witn ','"
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

export default TagElement;
