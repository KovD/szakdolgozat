import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Page from './pages/page/page.jsx';
import Fill from './pages/fill/fill.jsx';
import Create from './pages/create/create.jsx';
import './assets/webpage.css';
import Login from './popups/login.jsx'
import Header from './universal/header/header.jsx';
import withAuth from './withAut.jsx';
import QuizPalette from './pages/quiz/quiz_palette_not_inf.jsx';
import ListQuizes from './pages/ListQuizes/ListQuizes.jsx';
import TokenChecker from './TokenChecker.jsx';
import About from './pages/about/about.jsx';

const ProtectedCreate = withAuth(Create);
const ProtectedList = withAuth(ListQuizes);

function App() {
    const [showLogin, setShowLogin] = useState(false);

    const loginShowerTrue = () => {
        setShowLogin(true)
    }

    const loginShowerFalse = () => {
        setShowLogin(false)
    }

    return (
        <Router>
            <div>
                {showLogin && <><div className="overlay" onClick={loginShowerFalse}></div><Login onClose={loginShowerFalse} /></>}
                <Header loginShowerTrue={loginShowerTrue}/>
                <Routes>
                    <Route path="/" element={<Page/>} />
                    <Route path="/create" element={<ProtectedCreate/>}/>
                    <Route path="/fill" element={<Fill />} />
                    <Route path="/quiz" element={<QuizPalette />} />
                    <Route path="/list" element={<ProtectedList />} />
                    <Route path="/About" element={<About />} />
                </Routes>
                <TokenChecker/>
            </div>
        </Router>
    );
}

export default App;
