import { useNavigate } from 'react-router-dom';
import './infiniteEndpoint.css';

function InfiniteEndpoints({ infiniteScore }) {
    const navigate = useNavigate()
    
    const goToBack = () => {
        navigate('/');
    };

    return(
        <div className="quiz-container copy-protection">
            <div className="quiz-header">
                Végleges pontszám: {infiniteScore}
            </div>
            
            <div className="results-content">
                <h3 className="score-display">
                    <span className="score-label">Elért pontok:</span>
                    <span className="score-value">{infiniteScore}</span>
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

export default InfiniteEndpoints;