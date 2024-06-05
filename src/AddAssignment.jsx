import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAssignment = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); // Ensure token is stored correctly
        try {
            const response = await fetch('http://localhost:8080/api/tasks/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            });

            if (response.ok) {
                // Navigate back to assignments list or show success message
                navigate('/assignments');
            } else {
                throw new Error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    return (
        <div class="flexitems-center justify-center">
            
             <h1 className=' text-white '>Add New Assignment</h1>

            <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <label>
                    Description:
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                </label>
                <button type="submit">Add Assignment</button>
            </form>
        </div>
    );
};

export default AddAssignment;
