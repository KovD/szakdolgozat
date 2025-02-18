import './create.css';
import Props from '../create_blocks/prop';
import { useState } from 'react';

function Create() {
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const togglePopup = () => {
        setIsPopupVisible(!isPopupVisible);
    };

    const onClose = () => {
        togglePopup();
    };

    return (
        <div id="create">
            <Props onClose={onClose} isPopupVisible={isPopupVisible} togglePopup={togglePopup} />
            <div id="publish">
                <button>Save</button>
                <button>Upload</button>
            </div>
            {isPopupVisible && (
                <div id="overlay" onClick={onClose}></div>
            )}
        </div>
    );
}

export default Create;
