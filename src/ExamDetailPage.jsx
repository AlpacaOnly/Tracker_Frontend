import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import CodeEditor from './MonacoEditor/components/CodeEditor';
import { Box } from '@chakra-ui/react';

const ExamDetailPage = () => {
    const [examStarted, setExamStarted] = useState(false);
    const [taskDescription, setTaskDescription] = useState("");
    const [timer, setTimer] = useState(1800); // 30 minutes for the timer
    const [intervalId, setIntervalId] = useState(null);
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [ws, setWs] = useState(null);

    const ID = localStorage.getItem("ID");
    const roleID = localStorage.getItem("roleID");
    const [exam, setExam] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchExaminations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/teacher/${ID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setExam(data);
                } else {
                    console.error('Failed to fetch examinations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching examinations:', error);
            }
        };

        fetchExaminations();

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
    }, [ID, intervalId]);

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

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                {exam.length > 0 ? (
                    <>
                        <h1 className="text-2xl font-bold text-white">{exam[0].Title} Exam</h1>
                        <p><strong>Date:</strong> {exam[0].AccessFrom}</p>
                        <p><strong>Time:</strong> {exam[0].AccessTo}</p>
                        <p><strong>Description:</strong> {exam[0].Description}</p>

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
                                        <Box minH="100vh" bg="#0f0a19" color="gray.500" px={6} py={8}>
                                            <CodeEditor />
                                        </Box>
                                        <button onClick={handleEndExam} className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                            Submit Exam
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <p>Loading exam details...</p>
                )}
            </div>
        </div>
    );
};

export default ExamDetailPage;
