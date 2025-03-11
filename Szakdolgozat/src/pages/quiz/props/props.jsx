import { useState } from "react";
import './props.css'

function Props({ showProps, quizData, setPropsValues }) {
    const { title, props } = quizData;
    const [localProps, setLocalProps] = useState(
        props.reduce((acc, prop) => {
            acc[prop.value] = "";
            return acc;
        }, {})
    );

    const handleChange = (e) => {
        setLocalProps({
            ...localProps,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = () => {
        const isAnyFieldEmpty = Object.values(localProps).some(value => value.trim() === "");
      
        if (isAnyFieldEmpty) {
          alert("Kérjük, töltsön ki minden mezőt!");
          return;
        }
      
        const formattedProps = props.map(prop => ({
          id: prop.value,
          value: localProps[prop.value]
        }));
      
        setPropsValues(formattedProps);
        showProps();
      };

    return (
        <div className="props-container copy-protection">
            <h2 className="props-title">{title}</h2>
            {props.map((prop, index) => (
                <div className="prop-group" key={index}>
                    <label>{prop.value}</label>
                    <input
                        type="text"
                        className="prop-input"
                        name={prop.value}
                        value={localProps[prop.value]}
                        onChange={handleChange}
                        maxLength={20}
                    />
                </div>
            ))}
            <button 
                className="props-button" 
                onClick={handleSubmit}
            >
                Start
            </button>
        </div>
    );
}


export default Props;