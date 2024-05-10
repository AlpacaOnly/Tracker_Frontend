import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Examinations = () => {
    const [exams, setExams] = useState([]); // State to hold examination data
    const navigate = useNavigate();
    const userId = localStorage.getItem('RoleID');

    useEffect(() => {
        // Fetch examination data from the API
        const fetchExaminations = async () => {
            try {
                const token = localStorage.getItem('token'); // Get auth token from local storage
                const response = await fetch(`http://localhost:8080/api/tasks/getAllTeacherTasks/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setExams(data); // Update state with fetched examination data
                } else {
                    console.error('Failed to fetch examinations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching examinations:', error);
            }
        };

        fetchExaminations();
    }, []);

    const handleStartExam = (exam) => {
        navigate(`/exam/${exam.id}`);
    };

    const handleAddExamination = () => {
        navigate('/examination/add'); // Adjust the route as necessary
    };

    return (
        <div className="flex">
            <Navbar/>
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Upcoming Examinations</h1>
                <button
                    onClick={handleAddExamination}
                    className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Examination
                </button>
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Access From</th>
                            <th className="px-4 py-2 text-left">Access To</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <tr key={exam.id} className="bg-white border-b">
                                <td className="px-4 py-2">{exam.title}</td>
                                <td className="px-4 py-2">{exam.description}</td>
                                <td className="px-4 py-2">{exam.accessFrom}</td>
                                <td className="px-4 py-2">{exam.accessTo}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleStartExam(exam)}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                    >
                                        Start
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Examinations;
