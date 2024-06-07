import React from 'react';
import Navbar from './Navbar';

// Sample data for grades
const gradesData = [
    { id: 1, subject: 'Advanced Programming', grade: 'A', credits: 3 },
    { id: 2, subject: 'C++', grade: 'B+', credits: 3 },
    { id: 3, subject: 'English', grade: 'A-', credits: 3 }
];

const Grades = () => {
    return (
        <div className="flex">
        <Navbar/>
    
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold text-white mb-4">Grades Overview</h1>
            <table className="min-w-full table-auto">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-4 py-2 text-left">Subject</th>
                        <th className="px-4 py-2 text-left">Grade</th>
                        <th className="px-4 py-2 text-left">Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {gradesData.map((grade) => (
                        <tr key={grade.id} className="bg-gray-700 border-b">
                            <td className="px-4 py-2">{grade.subject}</td>
                            <td className="px-4 py-2">{grade.grade}</td>
                            <td className="px-4 py-2">{grade.credits}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    );
};

export default Grades;
