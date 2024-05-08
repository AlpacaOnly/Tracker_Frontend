import React from 'react';
import Navbar from './Navbar';

const assignments = [
    { id: 1, name: 'Math Homework', deadline: '2024-05-10', status: 'Pending', teacher: 'Mr. Smith' },
    { id: 2, name: 'Science Project', deadline: '2024-05-15', status: 'Completed', teacher: 'Ms. Johnson' },
    { id: 3, name: 'Literature Essay', deadline: '2024-05-20', status: 'Pending', teacher: 'Mrs. Lee' },
    { id: 4, name: 'History Presentation', deadline: '2024-05-25', status: 'In Progress', teacher: 'Mr. Brown' }
];

const Assignment = () => {
    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 pt-4 pl-72 pr-4 md:pl-4 md:pr-4 sm:pl-4 sm:pr-4"> {/* Responsive padding adjustment */}
                <h1 className="text-xl font-bold my-4">Assignments List</h1>
                <div>
                    {assignments.map(assignment => (
                        <div key={assignment.id} className="mb-3 p-3 shadow-lg rounded-lg">
                            <h2 className="text-lg font-semibold">{assignment.name}</h2>
                            <p>Deadline: {assignment.deadline}</p>
                            <p>Status: <span className={assignment.status === 'Completed' ? 'text-green-500' : 'text-red-500'}>{assignment.status}</span></p>
                            <p>Teacher/Subject: {assignment.teacher}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Assignment;
