import './page.css'
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
        <button onClick={goToFill} id='page_button'>✎ Fill out</button>
        <button onClick={goToCreate} id='page_button'>+ Create</button>
        </div>
    </div>
}

export default Page