import { useEffect, useState } from 'react';
import QuizComponent from './Quiz';
import './quiz_list.css'
import { useNavigate } from 'react-router-dom';

const ListQuizes = () => {
  const [quizzes, setQuizzes] = useState([]);

  const navigate = useNavigate()
    const goToBack = () => {
        navigate('/');
    };

  useEffect(() => {
    const fetchData = async () => {
        const res = await fetch('http://localhost:5000/users/GetMyQuizes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('Hiba történt az adatok lekérésekor!');
        
        const jsonData = await res.json();
        setQuizzes(jsonData);
        console.log(quizzes[0].quizName)
    };

    fetchData();
  }, []);

  return (
    <div className="quiz-container">
      {quizzes.map((quiz, index) => (
        <QuizComponent
          key={index} 
          quiz={quiz}
        />
      ))}
      <button id="back-button" onClick={goToBack}>Back</button>
    </div>
  );
};

export default ListQuizes;