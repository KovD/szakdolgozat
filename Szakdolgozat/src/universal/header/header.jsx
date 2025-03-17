import { useState, useEffect } from 'react';
import './header.css';
import TxtButton from '../../universal/text_buttons.jsx';
import { useNavigate } from 'react-router-dom';

function Header({ loginShowerTrue }) {
    const navigate = useNavigate();

    const handleAuthClick = () => {
            if(localStorage.getItem('token')){
                localStorage.removeItem('token')
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
                <TxtButton onClick={goAbout}text="About"></TxtButton>
                <TxtButton onClick={goToList} text="My Quises"></TxtButton>
                <img 
                    src="src/assets/svg/login.svg" 
                    id="login" 
                    onClick={()=>handleAuthClick()}
                />
            </div>
        </div>
    );
}

export default Header;