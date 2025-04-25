import './create_design.css';
import Popup from './create_popup/prop_popup';
import {useRef, useEffect, useState } from 'react';
import TypeVis from './element/typeVis';

const LOCAL_STORAGE_KEY = 'quiz_props';

function Props({PropTitle, signal, fixProps, onClose, isPopupVisible, togglePopup, initialTimer = "", initialInfinite = false, initialProps = [],}) {
    const [type, setType] = useState("");
    const [name, setName] = useState("");
    const [typesList, setTypesList] = useState([]);
    const [timer, setTimer] = useState('');
    const [isInfinite, setIsInfinite] = useState(false);
    const [addedProps, setAddedProps] = useState([]);
    const typesListRef = useRef(typesList);

    useEffect(() => {
        setName(PropTitle || "");
        setTimer(initialTimer || 0);
        setIsInfinite(initialInfinite);
        setTypesList(initialProps);
      }, [PropTitle, initialTimer, initialInfinite, initialProps]);

    useEffect(() => {
        typesListRef.current = typesList;
    }, [typesList]);

    useEffect(() => {
        if(signal) {
            const propsData = typesListRef.current.map(item => ({
                title: item.name,
                type: item.type
            }));
            
            fixProps(name, parseInt(timer), isInfinite, propsData);
        }
    }, [signal]);

    const handleTypeChange = (selectedType, selectedName) => {
        if (typesList.length < 5) {
            setTypesList([...typesList, { type: selectedType, name: selectedName }]);
        } else {
            alert("You can add only 5 properties");
        }
    };

    const handleToggleInfinite = (e) => {
        setIsInfinite(e.target.checked);
    };
    

    const handleDelete = (index) => {
        const updatedTypesList = typesList.filter((_, i) => i !== index);
        setTypesList(updatedTypesList);
    };

    return (
        <div className='box'>
            <h1>Properties</h1>
            <label htmlFor='quiz-name'>Quiz Name:</label>
            <input 
            className="prop_box"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter quiz name"
            maxLength={30} 
            />
            <label htmlFor='timer'>Timer:</label>
            <input 
            className="prop_box"
            id="timer"
            type="number"
            value={timer}
            onChange={(e) => setTimer(e.target.value.replace(/\D/, ""))} 
            max={60}
            min={0}
            placeholder="Timer in min"
            />
             <div className="infinite-toggle">
                <input 
                    type="checkbox"
                    id="infinite-quiz"
                    checked={isInfinite}
                    onChange={handleToggleInfinite}
                />
                <label htmlFor="infinite-quiz">Infinite Quiz:</label>
                </div>
            <div className="types-container">
                {typesList.map((item, index) => (
                    <TypeVis signal={signal} key={index} onDelete={() => handleDelete(index)} type={item.type} name={item.name} />
                ))}
            </div>
            <button id="addProp" onClick={togglePopup}>Add</button>

            {isPopupVisible && (
                <Popup onClose={onClose} onChange={handleTypeChange} name="Select Type" type={type} />
            )}
        </div>
    );
}

export default Props;
