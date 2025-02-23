import './typeVis.css';

function TypeVis({ onDelete, type, name }) {
    console.log(name, type);
    return (
        <div id="typeC">
            {name}: {type}
            <div id="trash" onClick={onDelete}>(x)</div>
        </div>
    );
}

export default TypeVis;