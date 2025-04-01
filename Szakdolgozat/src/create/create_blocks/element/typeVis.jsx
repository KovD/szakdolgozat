import './typeVis.css';

function TypeVis({onDelete, type, name }) {

    return (
        <div id="typeC">
            {name}: {type}
            <div id="trash" onClick={onDelete}>ⓧ</div>
        </div>
    );
}

export default TypeVis;