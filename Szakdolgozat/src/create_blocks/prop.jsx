import './create_design.css';
import Popup from './create_popup/prop_popup';
import { useState } from 'react';

function Props({ onClose, isPopupVisible, togglePopup }) {
    const [type, setType] = useState('');  // Kezdeti típus

    const handleTypeChange = (selectedType) => {
        setType(selectedType);
    };

    return (
        <div className='box'>
            <h1>Properties</h1>
            <label htmlFor='quiz-name'>Quiz Name:</label>
            <input 
                className="prop_box"
                id="name"
                type="text" 
                placeholder="Enter quiz name"
            />
            <button id="addProp" onClick={togglePopup}>Add</button>

            {isPopupVisible && (
                <Popup onClose={onClose} onChange={handleTypeChange} name="Select Type" type={type} />
            )}
        </div>
    );
}

export default Props;
