import './header.css'
import TxtButton from '../../universal/text_buttons.jsx';
import { useNavigate } from 'react-router-dom';


function Header({loginShowerTrue}) {

    const navigate = useNavigate()
    const goToList = () => {
        navigate('/list');
    };

    return <div id="header">
        <TxtButton id="left"></TxtButton>
        <div id='right' >
            <TxtButton text="About"></TxtButton>
            <TxtButton onClick={goToList} text="My Quises"></TxtButton>
            <img src="src/assets/svg/login.svg" alt="Login" id="login" onClick={() => loginShowerTrue()}/>
        </div>
    </div>;
}

export default Header;