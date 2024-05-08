import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const examData = [
    { id: 1, subject: 'Advanced Programming', date: '2024-06-15', time: '09:00 AM'}
];

const Examinations = () => {
    const navigate = useNavigate();

    const handleStartExam = (exam) => {
        // Navigate to an exam-specific page. You could use exam.id or exam.subject to uniquely identify the exam page.
        navigate(`/exam/${exam.subject}`); // URL is just an example, adjust based on your routing setup
    };

    return (
        <div className="flex">
            <Navbar/>
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Upcoming Examinations</h1>
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Subject</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Time</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examData.map((exam) => (
                            <tr key={exam.id} className="bg-white border-b">
                                <td className="px-4 py-2">{exam.subject}</td>
                                <td className="px-4 py-2">{exam.date}</td>
                                <td className="px-4 py-2">{exam.time}</td>
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
