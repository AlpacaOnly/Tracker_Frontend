import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const examData = [
    {
        id: 1,
        title: 'Advanced Programming',
        description: 'Final exam covering all material from the semester.',
        accessFrom: '2024-06-15',
        accessTo: '09:00 AM to 12:00 PM'
    }
];

const Examinations = () => {
    const [roleID, setRoleID] = useState(null); // State to hold the role ID
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user role from localStorage or another state management solution
        const fetchUserRole = async () => {
            const userRole = localStorage.getItem('RoleID'); // Assuming the role is stored in localStorage
            setRoleID(parseInt(userRole, 10)); // Convert to integer for strict comparison
        };

        fetchUserRole();
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
                {roleID === 2 && (
                    <button
                        onClick={handleAddExamination}
                        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Examination
                    </button>
                )}
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
                        {examData.map((exam) => (
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
