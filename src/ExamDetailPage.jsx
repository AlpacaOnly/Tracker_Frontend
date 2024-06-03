import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

    const ID = localStorage.getItem("id");
    const roleID = localStorage.getItem("roleID");

    console.log(ID);

    const [taskDetails, setTaskDetails] = useState({
        description: '',
        title: '',
        AccessTo: '',
        AccessFrom: ''
    });
    const [examinations, setExaminations] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const fetchTaskDetails = async () => {
            try {
                const url = roleID === '0' ? `http://localhost:8080/api/tasks/student/${ID}` : `http://localhost:8080/api/tasks/teacher/${ID}`;
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (roleID === '0') {
                    setExaminations(data);
                } else {
                    setExaminations(data);
                }
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        fetchTaskDetails();

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

    const handleUpdateExam = async (examId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/update/${examId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ /* Add necessary data here */ })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log("Update response:", data);
        } catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    };

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (roleID === '0' && examinations.length === 0) {
        return <div>Loading examinations...</div>;
    }

    if (roleID === '1' && !taskDetails.title) {
        return <div>Loading exam details...</div>;
    }

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                {roleID === '0' ? (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800">Student Examinations</h1>
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Title</th>
                                    <th className="py-2">Description</th>
                                    <th className="py-2">Access From</th>
                                    <th className="py-2">Access To</th>
                                    <th className="py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {examinations.map((exam, index) => (
                                    <tr key={index}>
                                        <td className="py-2">{exam.title}</td>
                                        <td className="py-2">{exam.description}</td>
                                        <td className="py-2">{exam.AccessFrom}</td>
                                        <td className="py-2">{exam.AccessTo}</td>
                                        <td className="py-2">
                                            <button onClick={handleStartExam} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                Start Exam
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-white">{taskDetails.title} Exam</h1>
                        <p><strong>Date:</strong> {taskDetails.AccessFrom}</p>
                        <p><strong>Time:</strong> {taskDetails.AccessTo}</p>
                        <p><strong>Description:</strong> {taskDetails.description}</p>
                        
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
                )}
            </div>
        </div>
    );
};

export default ExamDetailPage;
