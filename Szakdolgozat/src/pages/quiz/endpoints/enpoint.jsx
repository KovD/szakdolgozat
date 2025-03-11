import { useNavigate } from 'react-router-dom';
import './endpoint.css';

function Endpoint({ score }) {
    const navigate = useNavigate();
    const roundedScore = Math.round(score);

    const goToBack = () => {
        navigate('/');
    };

    return (
        <div className="quiz-container copy-protection">
            <div className="quiz-header">
                Kvíz eredménye
            </div>
            
            <div className="results-content">
                <h3 className="score-display">
                    <span className="score-label">Teljesítmény:</span>
                    <span className="score-value">{roundedScore}%</span>
                </h3>
                
                <button 
                    onClick={goToBack} 
                    className="quiz-button"
                >
                    Vissza a főoldalra
                </button>
            </div>
        </div>
    );
}

export default Endpoint;