import React, { useState } from "react";
import './login.css';

function Login({ onClose }) {
    const API_URL = import.meta.env.VITE_API_URL;
    const [reg, setReg] = useState(false);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);

    const switchPopup = () => {
        setReg(!reg);
        setError('');
        setUsername('');
        setPassword('');
        setPassword2('');
        setIsUsernameTaken(false);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleUsernameChange = (event) => {
        const value = event.target.value;
        setUsername(value);
        if (value.length > 0) {
            checkUsernameAvailability(value);
        }
    };

    const handlePassword2Change = (event) => {
        setPassword2(event.target.value);
        if (event.target.value !== password) {
            setError('A jelszavak nem egyeznek');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (reg) {
            if (password !== password2) {
                setError('A jelszavak nem egyeznek');
                return;
            }
    
            const response = await fetch(`${API_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    password: password
                }),
            });
    
            if (response.ok) {
                alert('Sikeres regisztráció!');
                switchPopup();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Regisztráció sikertelen');
            }
        } else {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userName: username,
                    password: password
                }),
            });
    
            if (response.ok) {
                const userData = await response.json();
                if (userData.token) {
                    localStorage.setItem('token', userData.token);
                    onClose();
                } else {
                    setError('Bejelentkezés sikertelen');
                }
            } else {
                setError('Érvénytelen felhasználónév vagy jelszó');
            }
        }
    };

    const renderLoginForm = () => (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Felhasználónév:</label><br />
            <input
                type="text"
                id="username"
                placeholder="felhasználónév"
                value={username}
                onChange={handleUsernameChange}
                required
            />
            <br />
            <label htmlFor="password">Jelszó:</label><br />
            <input
                type="password"
                id="password"
                placeholder="Jelszó"
                value={password}
                onChange={handlePasswordChange}
                required
            />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button id="logButton" type="submit">Bejelentkezés</button><br />
            <button id="regButton" type="button" onClick={switchPopup}>
                Regisztráció
            </button>
        </form>
    );

    const renderRegistrationForm = () => (
        <form onSubmit={handleSubmit}>
            <label htmlFor="newusername">Felhasználónév:</label><br />
            <input
                type="text"
                id="newusername"
                placeholder="felhasználónév"
                value={username}
                onChange={handleUsernameChange}
                maxLength={10}
                required
            />
            {isUsernameTaken && <p style={{ color: 'red' }}>A felhasználónév már foglalt.</p>}
            <br />
            <label htmlFor="newpassword">Jelszó:</label><br />
            <input
                type="password"
                id="newpassword"
                placeholder="Jelszó"
                value={password}
                onChange={handlePasswordChange}
                maxLength={10}
                required
            />
            <br />
            <label htmlFor="newpassword2">Jelszó újra:</label><br />
            <input
                type="password"
                id="newpassword2"
                placeholder="Jelszó újra"
                value={password2}
                onChange={handlePassword2Change}
                maxLength={10}
                required
            />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button type="button" onClick={switchPopup}>Vissza</button><br />
            <button type="submit">Regisztráció</button>
        </form>
    );

    return (
        <div id='popup'>
            <div id='x' onClick={onClose}>×</div>
            <div id="panel">
                {!reg ? renderLoginForm() : renderRegistrationForm()}
            </div>
        </div>
    );
}

export default Login;