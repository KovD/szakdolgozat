import React, { useState } from "react";
import './login.css';

function Login({ onClose }) {
    const [reg, setReg] = useState(false);

    const switchPopup = () => {
        setReg(!reg);
    };

    const TestPing = () => {
        console.log("Bejelentkezés gomb megnyomva");
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
                            required
                        />
                        <br />
                        <label htmlFor="password">Jelszó:</label><br />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Jelszó"
                            required
                        />
                        <br />
                        <button id="logButton" onClick={TestPing}>Bejelentkezés</button><br />
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
                            required
                        />
                        <label htmlFor="newpassword">Password:</label><br />
                        <input
                            type="password"
                            id="newpassword"
                            name="newpassword"
                            placeholder="password"
                            required
                        />
                        <label htmlFor="password2">Password again:</label><br />
                        <input
                            type="password"
                            id="newpassword2"
                            name="newpassword2"
                            placeholder="password again"
                            required
                        />
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Login;
