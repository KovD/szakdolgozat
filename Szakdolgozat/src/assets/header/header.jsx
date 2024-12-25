import './header.css'
import TxtButton from '../universal/text_buttons';
function Header() {
    return <div id="header">
        <TxtButton text="About"></TxtButton>
        <TxtButton text="My Quises"></TxtButton>
        <img src="src/assets/svg/login.svg" alt="Login" id="login" />
    </div>;
}

export default Header;