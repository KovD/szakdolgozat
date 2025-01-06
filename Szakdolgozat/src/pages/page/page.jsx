import './page.css'
import Header from '../../universal/header/header'
import { useNavigate } from 'react-router-dom';
function Page(value) {

        const navigate = useNavigate();

        const goToCreate = () => {
            navigate('/create');
        };

        const goToFill = () => {
            navigate('/fill');
        };

    return <div>
        <div id='BB'>
        <button onClick={goToFill}>✎ Fill out</button>
        <button onClick={goToCreate}>+ Create</button>
        </div>
    </div>
}

export default Page