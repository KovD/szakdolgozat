import './header.css'
import TxtButton from '../../universal/text_buttons.jsx';


function Header({loginShowerTrue}) {


    return <div id="header">
        <TxtButton id="left"></TxtButton>
        <div id='right' >
            <TxtButton text="About"></TxtButton>
            <TxtButton text="My Quises"></TxtButton>
            <img src="src/assets/svg/login.svg" alt="Login" id="login" onClick={() => loginShowerTrue()}/>
        </div>
    </div>;
}

export default Header;