import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Navbar from './Navbar';

const AddExamination = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [accessFrom, setAccessFrom] = useState(new Date().toISOString().slice(0, -8)); // Format date for datetime-local input
    const [accessTo, setAccessTo] = useState(new Date().toISOString().slice(0, -8));
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if no token is found
                return;
            }
            try {
                const response = await fetch('http://localhost:8080/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStudents(data); // Assuming 'data' is an array of student objects
                } else {
                    throw new Error('Failed to fetch students');
                }
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
        const body = JSON.stringify({
            Title: title,
            Description: description,
            AccessFrom: new Date(accessFrom).toISOString(),
            AccessTo: new Date(accessTo).toISOString(),
        });

        try {
            const response = await fetch('http://localhost:8080/api/tasks/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.ok) {
                const taskData = await response.json();
                
                // Assign students to the created task
                await assignStudentsToTask(taskData.ID, selectedStudents.map(student => student.value), token);

                navigate('/examinations');
            } else {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to add examination');
            }
        } catch (error) {
            console.error('Error adding examination:', error);
        }
    };

    const assignStudentsToTask = async (taskId, studentIds, token) => {
        try {
            await Promise.all(studentIds.map(async (studentId) => {
                const response = await fetch(`http://localhost:8080/api/tasks/${taskId}/students/${studentId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(errorMsg || 'Failed to assign student to task');
                }
            }));

            console.log('Students assigned to task successfully');
        } catch (error) {
            console.error('Error assigning students to task:', error);
        }
    };

    const studentOptions = students.map(student => ({
        value: student.ID,
        label: `${student.Name} ${student.Surname}`
    }));

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center">
                    <h1 className="text-xl font-bold text-white mb-4">Add New Examination</h1>
                </div>
                <form onSubmit={handleSubmit} className="max-w-xl m-auto">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-100 text-sm font-bold mb-2">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-gray-100 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="accessFrom" className="block text-gray-100 text-sm font-bold mb-2">Access From</label>
                        <input
                            type="datetime-local"
                            id="accessFrom"
                            value={accessFrom}
                            onChange={(e) => setAccessFrom(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="accessTo" className="block text-gray-100 text-sm font-bold mb-2">Access To</label>
                        <input
                            type="datetime-local"
                            id="accessTo"
                            value={accessTo}
                            onChange={(e) => setAccessTo(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="students" className="block text-gray-100 text-sm font-bold mb-2">Assign Students</label>
                        <Select
                            id="students"
                            isMulti
                            value={selectedStudents}
                            onChange={setSelectedStudents}
                            options={studentOptions}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Add Examination
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExamination;
