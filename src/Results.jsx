import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Results = () => {
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if no token is found
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/results', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data); // Assuming 'data' is an array of student objects who passed the exams
                } else {
                    throw new Error('Failed to fetch students');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [navigate]);

    const handleGrades = (studentId) => {
        navigate(`/grades/${studentId}`);
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-bold text-white">Passed Students</h1>
                </div>
                <table className="min-w-full bg-gray-800 text-white">
                    <thead>
                        <tr>
                            <th className="py-2">Student ID</th>
                            <th className="py-2">Name</th>
                            <th className="py-2">Surname</th>
                            <th className="py-2">Grade</th>
                            <th className="py-2">View Grades</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student.ID} className="border-t border-gray-700">
                                <td className="py-2 px-4">{student.ID}</td>
                                <td className="py-2 px-4">{student.Name}</td>
                                <td className="py-2 px-4">{student.Surname}</td>
                                <td className="py-2 px-4">{student.Grade}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        onClick={() => handleGrades(student.ID)}
                                    >
                                        Grades
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

export default Results;
