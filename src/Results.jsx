import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Results = () => {
    const [tasks, setTasks] = useState([]); // State to hold task data
    const [solutions, setSolutions] = useState([]); // State to hold solutions data
    const [cheatingRate, setCheatingRate] = useState(null); // State to hold cheating rate data
    const navigate = useNavigate();
    const ID = localStorage.getItem('id');
    const roleID = localStorage.getItem('roleID');

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get auth token from local storage

        const fetchTasks = async () => {
            try {
                const endpoint = roleID === '1'
                    ? `http://localhost:8080/api/tasks/student/${ID}`
                    : `http://localhost:8080/api/tasks/teacher/${ID}`;
                
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Tasks:', data); // Debugging: log fetched tasks
                    setTasks(data); // Update state with fetched task data

                    if (roleID === '1') {
                        fetchSolutionsByStudent(ID);
                    }
                } else {
                    console.error('Failed to fetch tasks:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };

        const fetchSolutionsByStudent = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch(`http://localhost:8080/api/solutions/by-student/${ID}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched Solutions:', data); // Debugging: log fetched solutions
                    setSolutions(data); // Update state with fetched solutions data
                } else {
                    console.error('Failed to fetch solutions for student:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching solutions:', error);
            }
        };

        fetchTasks();
    }, [ID, roleID]);

    const formatDateTime = (isoString) => {
        if (!isoString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }; // Options to display date and time
        try {
            return new Date(isoString).toLocaleString('en-US', options);
        } catch (error) {
            console.error('Error formatting date:', isoString, error); // Debugging: log date format errors
            return 'Invalid Date';
        }
    };

    const generateReport = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/cheating-rate/${ID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Cheating Rate:', data); // Debugging: log cheating rate
                setCheatingRate(data.CheatingRate); // Update state with fetched cheating rate data
            } else {
                console.error('Failed to fetch cheating rate:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching cheating rate:', error);
        }
    };

    const renderSolutionsTable = () => (
        <table className="min-w-full table-auto">
            <thead className="bg-gray-800">
                <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Cheating Result</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Final Grade</th>
                    <th className="px-4 py-2 text-left">Report</th>
                    <th className="px-4 py-2 text-left">Solution</th>
                    <th className="px-4 py-2 text-left">Time End</th>
                    <th className="px-4 py-2 text-left">Time Start</th>
                    <th className="px-4 py-2 text-left">Cheating Rate</th>
                </tr>
            </thead>
            <tbody>
                {solutions.length > 0 ? (
                    solutions.map((solution) => (
                        <tr key={solution.ID} className="bg-gray-700 border-b">
                            <td className="px-4 py-2">{solution.ID}</td>
                            <td className="px-4 py-2">{solution.CheatingResult}</td>
                            <td className="px-4 py-2">{formatDateTime(solution.CreatedAt)}</td>
                            <td className="px-4 py-2">{solution.FinalGrade}</td>
                            <td className="px-4 py-2">{solution.Report || 'N/A'}</td>
                            <td className="px-4 py-2">{solution.Solution}</td>
                            <td className="px-4 py-2">{formatDateTime(solution.TimeEnd)}</td>
                            <td className="px-4 py-2">{formatDateTime(solution.TimeStart)}</td>
                            <td className="px-4 py-2">{cheatingRate !== null ? cheatingRate : 'N/A'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center py-4">
                            No solutions available.
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
                <h1 className="text-xl font-bold text-white mb-4">Solutions</h1>
                <button
                    onClick={generateReport}
                    className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Generate Report
                </button>
                {renderSolutionsTable()}
            </div>
        </div>
    );
};

export default Results;
