import { useEffect } from 'react';
import './typeVis.css';

function TypeVis({signal, collectProps,  onDelete, type, name }) {

    useEffect(() => {if(signal){collectProps(name, type)}}, [signal]);

    return (
        <div id="typeC">
            {name}: {type}
            <div id="trash" onClick={onDelete}>(x)</div>
        </div>
    );
}

export default TypeVis;