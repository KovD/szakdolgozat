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
        // if (value.length > 0) {
        //     checkUsernameAvailability(value);
        // }
    };

    const handlePassword2Change = (event) => {
        setPassword2(event.target.value);
        if (event.target.value !== password) {
            setError('The passwords are not the same');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (reg) {
            if (password !== password2) {
                setError('The passwords are not the same');
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
                alert('Succesfull registration');
                switchPopup();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Unsuccsesfull Registration');
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
                    window.dispatchEvent(new Event("storage"));
                    onClose();
                } else {
                    alert('Ligin Unsucsessful');
                }
            } else {
                setError('Invalid username or password');
            }
        }
    };
    const renderLoginForm = () => (
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label><br />
            <input
                type="text"
                id="username"
                placeholder="Username"
                value={username}
                onChange={handleUsernameChange}
                required
            />
            <br />
            <label htmlFor="password">Jelszó:</label><br />
            <input
                type="password"
                id="password"
                placeholder="password"
                value={password}
                onChange={handlePasswordChange}
                required
            />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="login-buttons">
                <button type="submit">Login</button><br />
                <button type="button" onClick={switchPopup}>Registration</button>
            </div>
        </form>
    );

    const renderRegistrationForm = () => (
        <form onSubmit={handleSubmit}>
            <label htmlFor="newusername">Username:</label><br />
            <input
                type="text"
                id="newusername"
                placeholder="username"
                value={username}
                onChange={handleUsernameChange}
                maxLength={10}
                required
            />
            {isUsernameTaken && <p style={{ color: 'red' }}>Username is taken</p>}
            <br />
            <label htmlFor="newpassword">Password:</label><br />
            <input
                type="password"
                id="newpassword"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                maxLength={10}
                required
            />
            <br />
            <label htmlFor="newpassword2">Pawwsord again:</label><br />
            <input
                type="password"
                id="newpassword2"
                placeholder="Password again"
                value={password2}
                onChange={handlePassword2Change}
                maxLength={10}
                required
            />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="login-buttons">
                <button type="submit">Registration</button>
                <button type="button" onClick={switchPopup}>Back to login</button><br />
            </div>

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