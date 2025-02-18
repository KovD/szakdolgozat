import React, { useState } from "react";
import './login.css';

function Login({ onClose }) {
    const [reg, setReg] = useState(false);
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [isUsernameTaken, setIsUsernameTaken] = useState(false);

    const switchPopup = () => {
        setReg(!reg);
        setError('')
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
            setError('The password aren\'t the same');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        if (reg) {
            if (password !== password2) {
                setError('The passwords do not match');
                return;
            }
    
            const response = await fetch('http://localhost:5000/api/Register/Register', {
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
                console.log('Registration successful!');
                alert('Registration successful!');
                switchPopup();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } else {
            alert(username)
            const response = await fetch('http://localhost:5000/api/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ UserName: username, Password: password }),
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    alert("Sikeres bejelentkezés!");
                } else {
                    setError(data.message || "Hibás adatok.");
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Hiba a kérésben.");
            }
        }
    };

    const checkUsernameAvailability = async (username) => {
        try {
            const response = await fetch(`http://localhost:5000/api/UsernameTaken/IsUsernameTaken/${username}`);
            const data = await response.json();
            setIsUsernameTaken(data.isTaken);
        } catch (error) {
            console.error('Error checking username availability:', error);
        }
    };

    return (
        <div id='popup'>
            <div id='x' onClick={() => onClose()}>x</div>
            <div id="panel">
                {!reg ? (
                    <form>
                        <label htmlFor="username">Felhasználónév:</label><br />
                        <input
                            type="text"
                            id="username"
                            name="username"
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
                            name="password"
                            placeholder="Jelszó"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <br />
                        <button id="logButton" onClick={handleSubmit}>Bejelentkezés</button><br />
                        <button id="regButton" onClick={() => switchPopup()}>Regisztráció</button><br />
                    </form>
                ) : (
                    <div>
                        <form>
                        <label htmlFor="username">Username:</label><br />
                        <input
                            type="text"
                            id="newusername"
                            name="newusername"
                            placeholder="username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            maxLength={10}
                        />
                        {isUsernameTaken && <p style={{ color: 'red' }}>Username is taken.</p>}<br></br>
                        <label htmlFor="newpassword">Password:</label><br />
                        <input
                            type="password"
                            id="newpassword"
                            name="newpassword"
                            placeholder="password"
                            maxLength={10}
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        /><br></br>
                        <label htmlFor="password2">Password again:</label><br />
                        <input
                            type="password"
                            id="newpassword2"
                            name="newpassword2"
                            placeholder="password again"
                            value={password2}
                            onChange={handlePassword2Change}
                            maxLength={10}
                            required
                        /><br></br>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button onClick={() => switchPopup()}>Back</button><br />
                        <button onClick={handleSubmit}>Registration</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
