import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import MonacoEditor from 'react-monaco-editor';  // Import MonacoEditor
import CodeEditor from './MonacoEditor/components/CodeEditor';

// import CodeEditor from "./Components/CodeEditor";

const ExamDetailPage = () => {
    const { subject } = useParams();
    const [examDetails, setExamDetails] = useState(null);
    const [examStarted, setExamStarted] = useState(false);
    const [taskDescription, setTaskDescription] = useState("");
    const [timer, setTimer] = useState(1800); // 30 minutes for the timer
    const [intervalId, setIntervalId] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const fetchExamDetails = async () => {
            const examData = {
                subject: subject,
                date: '2024-06-15',
                time: '09:00 AM',
                description: 'Final exam covering all material from the semester.'
            };
            setExamDetails(examData);
        };

        fetchExamDetails();

        // Initialize WebSocket connection
        const webSocket = new WebSocket('ws://localhost:8001');
        webSocket.onopen = () => {
            console.log('WebSocket Connected');
        };
        webSocket.onclose = () => {
            console.log('WebSocket Disconnected');
        };
        setWs(webSocket);

        return () => {
            if (webSocket) {
                webSocket.close();
            }
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [subject, intervalId]);

    const handleStartExam = () => {
        setExamStarted(true);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('start');
        }
        const id = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(id);
                    handleEndExam();
                }
                return prevTimer - 1;
            });
        }, 1000);
        setIntervalId(id);
    };

    const handleEndExam = () => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send('stop');
        }
        clearInterval(intervalId);
        setExamStarted(false);
        setSubmissionMessage("Your exam has been submitted and is pending review by a teacher. You will see your grade on the Grades page.");
        console.log("Task Submitted:", taskDescription);
        setTaskDescription("");
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!examDetails) {
        return <div>Loading exam details...</div>;
    }

    return (
        <div className="flex">
            <Navbar/>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold text-gray-800">{examDetails.subject} Exam</h1>
                <p><strong>Date:</strong> {examDetails.date}</p>
                <p><strong>Time:</strong> {examDetails.time}</p>
                <p><strong>Description:</strong> {examDetails.description}</p>
                {submissionMessage ? (
                    <div>
                        <p className="text-green-500">{submissionMessage}</p>
                        <Link to="/grades" className="text-blue-500 hover:text-blue-700">View Grades</Link>
                    </div>
                ) : (
                    <>
                        {!examStarted ? (
                            <button onClick={handleStartExam} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Start Exam
                            </button>
                        ) : (
                            <div>
                                <p className="text-red-500 font-bold">Time remaining: {formatTime(timer)}</p>
                                
                                <CodeEditor />
                                
                                <button onClick={handleEndExam} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    Submit Exam
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ExamDetailPage;
