import './popup.css';
import { useState } from 'react';

function Popup({ onClose, onChange}) {

  const [name, setName] = useState('');

  const handleButtonClick = (selectedType, name) => {
    if (name.trim() !== '') {
      onChange(selectedType, name);
      onClose();
    } else {
      alert('Please enter a valid name');
    }
  };

    return (
        <div id="popup">
            <div id="back" onClick={onClose}>x</div>
            <div id="popup-content">
                <label htmlFor="name">Type the name of the property: </label>
                <input type="text" 
                name="name"
                value={name}
                maxLength={7}
                onChange={(e) => setName(e.target.value)}
                />
                <p>Choose input type:</p>
                <div className="button-group">
                    <button className='type' onClick={() => handleButtonClick('Text', name)}>Text</button>
                    <button className='type' onClick={() => handleButtonClick('Number', name)}>Number</button>
                </div>
            </div>
        </div>
    );
}

export default Popup;
