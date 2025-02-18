import './popup.css';

function Popup({ onClose, onChange, name, type }) {
    const handleButtonClick = (selectedType) => {
        onChange(selectedType);  // Típus váltása
    };

    return (
        <div id="popup">
            <div id="back" onClick={onClose}>x</div>
            <div id="popup-content">
                <h2>{name}</h2>
                <p>Choose input type:</p>
                <div className="button-group">
                    <button onClick={() => handleButtonClick('Text')}>Text</button>
                    <button onClick={() => handleButtonClick('Number')}>Number</button>
                </div>
                <p>Current type: {type}</p>
            </div>
        </div>
    );
}

export default Popup;
