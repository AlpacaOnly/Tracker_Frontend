import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const Solutions = () => {
    const { examid } = useParams(); // Get the task ID from the URL parameters
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get auth token from local storage

        const fetchSolutions = async () => {
            try {
                // Simulating a delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const response = await fetch(`http://localhost:8080/api/solutions/solved-task/${examid}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data); // Log the data to inspect its structure
                    setSolutions(data || []); // Update state with fetched solutions data, ensure it is an array
                } else {
                    const errorMsg = await response.text();
                    throw new Error(errorMsg || 'Failed to fetch solutions');
                }
            } catch (error) {
                console.error('Error fetching solutions:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSolutions();
    }, [examid]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4">
                <h1 className="text-xl font-bold text-white mb-4">Solutions for Task {examid}</h1>
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Student ID</th>
                            <th className="px-4 py-2 text-left">Solution</th>
                            <th className="px-4 py-2 text-left">Report ID</th>
                            <th className="px-4 py-2 text-left">Time Start</th>
                            <th className="px-4 py-2 text-left">Time End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.length > 0 ? (
                            solutions.map((solution, index) => (
                                <tr key={index} className="bg-gray-700 border-b">
                                    <td className="px-4 py-2">{solution.ID}</td>
                                    <td className="px-4 py-2">{solution.StudentTask ? solution.StudentTask.student?.id || 'N/A' : 'N/A'}</td>
                                    <td className="px-4 py-2">
                                        <pre>{solution.Solution || 'No solution provided'}</pre>
                                    </td>
                                    <td className="px-4 py-2">{solution.ReportID}</td>
                                    <td className="px-4 py-2">{solution.TimeStart}</td>
                                    <td className="px-4 py-2">{solution.TimeEnd}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4">
                                    No solutions available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Solutions;
