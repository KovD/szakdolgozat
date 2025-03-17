import { useLocation } from 'react-router-dom';
import {useRef, useEffect, useState } from 'react';
import './quiz_palette.css';
import Props from './props/props';
import Questions from './questions/questions';

function QuizPalette() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [seenProps, setSeenProps] = useState(false);
    const [propsValues, setPropsValues] = useState({});
    const location = useLocation();
    const { quizData, code } = location.state || {};
    const FillerID = useRef(null);
    const [goQuest, setGoQuest] = useState(false);

    useEffect(() => {
        if (seenProps) {
            console.log(quizData)
            const uploadData = async () => {
                const payload = {
                    QuizID: quizData.id,
                    Props: propsValues,
                    Start: new Date().toISOString()
                };

                try {
                    const response = await fetch(`${API_URL}/users/UploadData`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        console.error("Upload failed");
                        return;
                    }

                    const data = await response.json();
                    console.log(data)
                    FillerID.current = data;
                    
                    setGoQuest(true);
                } catch (error) {
                    console.error("Error:", error);
                }
            };
            
            uploadData();
        }
    }, [seenProps]);

    return (
        <div>
            {quizData ? (
                goQuest ? (
                    <Questions
                        quizData={quizData}
                        Vprops={propsValues}
                        code={code}
                        fillerID={FillerID.current}
                    />
                ) : (
                    <Props 
                        showProps={() => setSeenProps(true)} 
                        quizData={quizData} 
                        setPropsValues={setPropsValues} 
                    />
                )
            ) : (
                <p>Error loading quiz.</p>
            )}
        </div>
    );
}

export default QuizPalette;