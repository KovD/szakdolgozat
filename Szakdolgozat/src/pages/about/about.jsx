import React from 'react';
import './About.css';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const toCreate = () => {
    navigate('/create');
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="about-container">
      <h1 className="academic-title">Academic Quiz Platform Demonstration</h1>
      
      <div className="feature-section">
        <div className="feature-card">
          <h2>📚 Rapid Quiz Construction</h2>
          <p>
            Registered users can create customized quizzes within minutes. 
            Features include:
            <span className="highlight">Time limit configuration</span>, 
            <span className="highlight">Custom input fields</span>, and 
            <span className="highlight">Dynamic content management</span>.
          </p>
        </div>

        <div className="feature-card">
          <h2>🔒 Unique Code Access System</h2>
          <p>
            No registration required for participants. Access quizzes instantly using a 
            <span className="highlight">6-character unique code</span> 
            provided by the creator.
          </p>
        </div>

        <div className="feature-card">
          <h2>🏷️ Dynamic Content Templating</h2>
          <p>
            Utilize our <code>$$tag$$</code> syntax for randomized content generation:
          </p>
          <pre className="code-example">
            {`Example:
$vegetable$ = [carrot, radish, hazelnut]
Question: "Which $vegetable$ contains natural Vitamin C?"
Generated: "Which radish contains natural Vitamin C?"`}
          </pre>
        </div>

        <div className="feature-card">
          <h2>📈 Analytical Capabilities</h2>
          <ul className="feature-list">
            <li>★ Comprehensive rating system</li>
            <li>★ Real-time performance analytics</li>
            <li>★ Content management tools</li>
          </ul>
        </div>
      </div>

      <div className="cta-section academic-cta">
        <h3>Ready to Explore the Platform?</h3>
        <div className="button-container">
        <button className="cta-button back-button" onClick={goBack}>
          ⬅ Back
        </button>
        <button className="cta-button create-button" onClick={toCreate}>
          Initialize Quiz Creation 🚀
        </button>
      </div>
      </div>
    </div>
  );
};

export default About;