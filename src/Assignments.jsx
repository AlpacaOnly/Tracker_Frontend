import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Assignment = () => {
    const [assignments, setAssignments] = useState([]);
    const [userRole, setUserRole] = useState(null); // You'll need to fetch this
    const navigate = useNavigate();

    // Fetch assignments based on user role
    useEffect(() => {
        const fetchTasks = async () => {
            const token = localStorage.getItem('token'); // Assuming token is stored in local storage
            const userId = localStorage.getItem('RoleID');
            const apiUrl = userRole === 2 ? `http://localhost:8080/api/tasks/teacher/${userId}` : `http://localhost:8080/api/tasks/student/${userId}`;
            
            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAssignments(data); // Update state with fetched assignments
                } else {
                    console.error('Failed to fetch tasks:', response.status, response.statusText);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        fetchTasks();
    }, [userRole]);

    // Navigate to the add assignment page
    const handleAddAssignment = () => {
        navigate('/add-assignment');
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="flex-1 pt-4 pl-72 pr-4 md:pl-4 md:pr-4 sm:pl-4 sm:pr-4">
                <h1 className="text-xl font-bold my-4">Assignments List</h1>
                {userRole === 2 && (
                    <button onClick={handleAddAssignment} className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        Add Assignment
                    </button>
                )}
                {assignments.length > 0 ? (
                    <div>
                        {assignments.map((assignment) => (
                            <div key={assignment.ID} className="mb-3 p-3 shadow-lg rounded-lg">
                                <h2 className="text-lg font-semibold">{assignment.Title}</h2>
                                <p>Deadline: {assignment.AccessTo}</p>
                                <p>Status: <span className="text-blue-500">{assignment.Status}</span></p>
                                <p>Teacher ID: {assignment.TeacherID}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No assignments found.</p>
                )}
            </div>
        </div>
    );
};

export default Assignment;
