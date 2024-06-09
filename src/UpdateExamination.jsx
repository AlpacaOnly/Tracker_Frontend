import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Navbar from './Navbar';

const UpdateExamination = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [accessFrom, setAccessFrom] = useState('');
    const [accessTo, setAccessTo] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]); // Handle multiple selections
    const { examid } = useParams();
    const navigate = useNavigate();
    const ID = localStorage.getItem('ID'); // Assuming this is the TeacherID

    useEffect(() => {
        const fetchExaminationDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login'); // Redirect if no token is found
                return;
            }
            try {
                const response = await fetch(`http://localhost:8080/api/tasks/${examid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setTitle(data.Title);
                    setDescription(data.Description);
                    setAccessFrom(new Date(data.AccessFrom).toISOString().slice(0, -8));
                    setAccessTo(new Date(data.AccessTo).toISOString().slice(0, -8));
                } else {
                    throw new Error('Failed to fetch examination details');
                }
            } catch (error) {
                console.error('Error fetching examination details:', error);
            }
        };

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

        fetchExaminationDetails();
        fetchStudents();
    }, [navigate, examid]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selectedStudents.length === 0) {
            console.error('No students selected');
            return;
        }

        const token = localStorage.getItem('token');
        const body = JSON.stringify({
            Title: title,
            Description: description,
            AccessFrom: new Date(accessFrom).toISOString(),
            AccessTo: new Date(accessTo).toISOString(),
            TeacherID: parseInt(ID)
        });

        try {
            const response = await fetch(`http://localhost:8080/api/tasks/update/${examid}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.ok) {
                console.log('Examination updated successfully');

                // Assign the selected students to the task
                for (const student of selectedStudents) {
                    const assignResponse = await fetch(`http://localhost:8080/api/users/${student.value}/add-to-task/${examid}`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (assignResponse.ok) {
                        console.log(`Student ${student.label} assigned to the task successfully`);
                    } else {
                        const errorMsg = await assignResponse.text();
                        throw new Error(errorMsg || `Failed to assign student ${student.label} to the task`);
                    }
                }

                navigate('/examinations');
            } else {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to update examination');
            }
        } catch (error) {
            console.error('Error updating examination:', error);
        }
    };

    const studentOptions = students.map(student => ({
        value: student.ID,
        label: `${student.Name} ${student.Surname}`
    }));

    return (
        <div className="flex h-[calc(100vh-2rem)]">
            <Navbar />
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center">
                    <h1 className="text-xl font-bold text-white">Update Examination</h1>
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
                        <label htmlFor="student" className="block text-gray-100 text-sm font-bold mb-2">Assign Students</label>
                        <Select
                            id="student"
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
                            Update Examination
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateExamination;
