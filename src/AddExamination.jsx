import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const AddExamination = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [accessFrom, setAccessFrom] = useState(new Date()); // Initialize with current date and time
    const [accessTo, setAccessTo] = useState(new Date()); // Initialize with current date and time
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); // Get auth token from local storage

        try {
            const response = await fetch('http://localhost:8080/api/tasks/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    accessFrom: accessFrom.toISOString(), // Convert datetime to ISO string format
                    accessTo: accessTo.toISOString() // Convert datetime to ISO string format
                })
            });

            if (response.ok) {
                console.log('Examination added successfully');
                navigate('/examinations'); // Navigate back to the examinations page or to a success page
            } else {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Failed to add examination');
            }
        } catch (error) {
            console.error('Error adding examination:', error);
        }
    };

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-gray-800 mb-4">Add New Examination</h1>
                <form onSubmit={handleSubmit} className="max-w-xl m-auto">
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="accessFrom" className="block text-gray-700 text-sm font-bold mb-2">Access From</label>
                        <input
                            type="datetime-local"
                            id="accessFrom"
                            value={accessFrom.toISOString().slice(0, -8)} // Convert datetime to local datetime format
                            onChange={(e) => setAccessFrom(new Date(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="accessTo" className="block text-gray-700 text-sm font-bold mb-2">Access To</label>
                        <input
                            type="datetime-local"
                            id="accessTo"
                            value={accessTo.toISOString().slice(0, -8)} // Convert datetime to local datetime format
                            onChange={(e) => setAccessTo(new Date(e.target.value))}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
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
