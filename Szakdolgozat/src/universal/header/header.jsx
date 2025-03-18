import { useState, useEffect } from 'react';
import './header.css';
import TxtButton from '../../universal/text_buttons.jsx';
import { useNavigate } from 'react-router-dom';

function Header({ loginShowerTrue }) {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!localStorage.getItem('token'));
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
            navigate('/');
        } else {
            loginShowerTrue();
        }
    };

    const goToList = () => {
        navigate('/list');
    };

    const goAbout = () => {
        navigate('/About');
    };

    return (
        <div id="header">
            <TxtButton id="left"></TxtButton>
            <div id='right'>
                <TxtButton onClick={goAbout} text="About"></TxtButton>
                <TxtButton onClick={goToList} text="My Quizes"></TxtButton>
                <img 
                    src={isLoggedIn ? "src/assets/svg/logout.svg" : "src/assets/svg/login.svg"} 
                    id="login" 
                    onClick={handleAuthClick}
                    alt={isLoggedIn ? "Logout" : "Login"}
                />
            </div>
        </div>
    );
}

export default Header;
