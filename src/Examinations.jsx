import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Examinations = () => {
    const [exams, setExams] = useState([]); // State to hold examination data
    const navigate = useNavigate();
    const ID = localStorage.getItem('ID');
    console.log("ID is", ID)
    const roleID = localStorage.getItem('roleID');
    console.log("roleID is", roleID)

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get auth token from local storage

        const fetchStudentExaminations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/student/${ID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched student data:', data);
                    setExams(data); // Update state with fetched examination data
                } else {
                    console.error('Failed to fetch student examinations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching student examinations:', error);
            }
        };

        const fetchTeacherExaminations = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/teacher/${ID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched teacher data:', data);
                    const taskID = localStorage.setItem("taskID", data.id)
                    console.log("TASK ID IS", taskID)
                    setExams(data); // Update state with fetched examination data
                } else {
                    console.error('Failed to fetch teacher examinations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching teacher examinations:', error);
            }
        };

        if (roleID === '1') {
            fetchStudentExaminations();
        } else if (roleID === '2') {
            fetchTeacherExaminations();
        }
    }, [ID, roleID]);

    const handleStartExam = (exam) => {
        navigate(`/exam/${exam.ID}`);
    };

    const handleUpdateExam = (examId) => {
        navigate(`/examination/update/${examId}`);
    };

    const handleAddExamination = () => {
        navigate('/examination/add'); // Adjust the route as necessary
    };

    const handleDeleteExam = async (examId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://localhost:8080/api/tasks/delete/${examId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Examination deleted successfully');
                setExams(exams.filter(exam => exam.ID !== examId)); // Remove the deleted exam from the state
            } else {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to delete examination');
            }
        } catch (error) {
            console.error('Error deleting examination:', error);
        }
    };

    const formatDate = (isoString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }; // Options to display the date
        return new Date(isoString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-white mb-4">Upcoming Examinations</h1>
                {roleID === '2' && (
                    <button
                        onClick={handleAddExamination}
                        className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Add Examination
                    </button>
                )}
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">Title</th>
                            <th className="px-4 py-2 text-left">Description</th>
                            <th className="px-4 py-2 text-left">Access From</th>
                            <th className="px-4 py-2 text-left">Access To</th>
                            <th className="px-4 py-2 text-left">Start</th>
                            <th className="px-4 py-2 text-left">Update</th>
                            <th className="px-4 py-2 text-left">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.length > 0 ? (
                            exams.map((exam) => (
                                <tr key={exam.ID} className="bg-gray-700 border-b">
                                    <td className="px-4 py-2">{exam.Title}</td>
                                    <td className="px-4 py-2">{exam.Description}</td>
                                    <td className="px-4 py-2">{formatDate(exam.AccessFrom)}</td>
                                    <td className="px-4 py-2">{formatDate(exam.AccessTo)}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleStartExam(exam)}
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                        >
                                            Start
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleUpdateExam(exam.ID)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded ml-2"
                                        >
                                            Update Exam
                                        </button>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleDeleteExam(exam.ID)}
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-2"
                                        >
                                            Delete Exam
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
                                    No examinations available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Examinations;
