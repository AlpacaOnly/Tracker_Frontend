import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Examinations = () => {
    const [studentExams, setStudentExams] = useState([]); // State to hold student examination data
    const [teacherExams, setTeacherExams] = useState([]); // State to hold teacher examination data
    const navigate = useNavigate();
    const ID = localStorage.getItem('id');
    const roleID = localStorage.getItem('roleID');

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
                    setStudentExams(data); // Update state with fetched examination data
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
                    setTeacherExams(data); // Update state with fetched examination data
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
                setTeacherExams(teacherExams.filter(exam => exam.ID !== examId)); // Remove the deleted exam from the state
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

    const renderStudentTable = () => (
        <table className="min-w-full table-auto">
            <thead className="bg-gray-800">
                <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Access From</th>
                    <th className="px-4 py-2 text-left">Access To</th>
                    <th className="px-4 py-2 text-left">Start</th>
                </tr>
            </thead>
            <tbody>
                {studentExams.length > 0 ? (
                    studentExams.map((examWrapper) => (
                        <tr key={examWrapper.Task.ID} className="bg-gray-700 border-b">
                            <td className="px-4 py-2">{examWrapper.Task.Title}</td>
                            <td className="px-4 py-2">{examWrapper.Task.Description}</td>
                            <td className="px-4 py-2">{formatDate(examWrapper.Task.AccessFrom)}</td>
                            <td className="px-4 py-2">{formatDate(examWrapper.Task.AccessTo)}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleStartExam(examWrapper.Task)}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
                                >
                                    Start
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center py-4">
                            No examinations available.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    const renderTeacherTable = () => (
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
                {teacherExams.length > 0 ? (
                    teacherExams.map((exam) => (
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
    );

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
                {roleID === '1' ? renderStudentTable() : renderTeacherTable()}
            </div>
        </div>
    );
};

export default Examinations;
