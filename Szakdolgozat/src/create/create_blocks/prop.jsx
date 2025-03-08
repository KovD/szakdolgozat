import './create_design.css';
import Popup from './create_popup/prop_popup';
import {useRef, useEffect, useState } from 'react';
import TypeVis from './element/typeVis';
import {use } from 'react';

function Props({signal, fixProps, onClose, isPopupVisible, togglePopup }) {
    const [type, setType] = useState('');
    const [name, setName] = useState('');
    const [typesList, setTypesList] = useState([]);
    const [timer, setTimer] = useState('');
    const [isInfinite, setIsInfinite] = useState(false);
    const [addedProps, setAddedProps] = useState([]);
    const typesListRef = useRef(typesList);

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

    const handleToggleInfinite = () => {
        setIsInfinite(!isInfinite);
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
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter quiz name"
                maxLength={20} 
            />
            <label htmlFor='timer'>Timer:</label>
            <input 
                className="prop_box"
                id="name"
                type="number"
                onChange={(e) => setTimer(e.target.value)}
                maxLength={10} 
                placeholder="Timer in sec"
            />
             <div className="infinite-toggle">
                <label htmlFor="infinite-quiz">Infinite Quiz:</label>
                <button 
                    id="infinite-quiz"
                    onClick={handleToggleInfinite}
                >
                    {isInfinite ? 'Enabled' : 'Disabled'}
                </button>
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
