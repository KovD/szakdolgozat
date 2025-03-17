import { useEffect, useState } from 'react';
import QuizComponent from './Quiz';
import './quiz_list.css'
import { useNavigate } from 'react-router-dom';

const ListQuizes = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [quizzes, setQuizzes] = useState([]);

  const navigate = useNavigate()
    const goToBack = () => {
        navigate('/');
    };


  const handleDeleteQuiz = async (quizId) => {
    console.log(quizId)
    const res = await fetch(`${API_URL}/users/DeleteQuiz/${quizId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
      
    if (!res.ok) throw new Error('Failed to delete quiz');
    setQuizzes(quizzes.filter(q => q.QuizID !== quizId));

    window.location.reload()
  };

  useEffect(() => {
    const fetchData = async () => {
        const res = await fetch(`${API_URL}/users/GetMyQuizes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) throw new Error('There was an error, while getting the data');
        
        const jsonData = await res.json();
        setQuizzes(jsonData);
    };

    fetchData();
  }, []);

  return (
    <div className="quiz-container">
      {quizzes.map((quiz, index) => (
        <QuizComponent
          key={index} 
          quiz={quiz}
          onDelete={handleDeleteQuiz}
        />
      ))}
      <button id="back-button" onClick={goToBack}>Back</button>
    </div>
  );
};

export default ListQuizes;