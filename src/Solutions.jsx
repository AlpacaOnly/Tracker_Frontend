import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from './Navbar';

const Solutions = () => {
    const { examid } = useParams(); // Get the exam ID from the URL parameters
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [grades, setGrades] = useState({}); // State to manage grades
    const [cheatingRates, setCheatingRates] = useState({}); // State to manage cheating rates

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

                    // Initialize grades and cheating rates state with default values
                    const initialGrades = {};
                    const initialCheatingRates = {};
                    data.forEach(solution => {
                        initialGrades[solution.ID] = solution.finalGrade || 0;
                        initialCheatingRates[solution.ID] = 0; // Initialize cheating rate to 0
                    });
                    setGrades(initialGrades);
                    setCheatingRates(initialCheatingRates);
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

    const handleGenerateReport = async (solutionId) => {
        const token = localStorage.getItem('token'); // Get auth token from local storage
        try {
            const response = await fetch(`http://localhost:8080/api/solutions/generate-cheating-rate/${solutionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Report generated successfully:', data); // Log the response
                updateCheatingRate(solutionId, data.CheatingRate);
            } else {
                const errorMsg = await response.text();
                console.error('Failed to generate report:', errorMsg);
            }
        } catch (error) {
            console.error('Error generating report:', error);
        }
    };

    const updateCheatingRate = (solutionId, cheatingRate) => {
        setCheatingRates(prevState => ({
            ...prevState,
            [solutionId]: cheatingRate
        }));
    };

    const handleGradeChange = (solutionId, grade) => {
        setGrades({
            ...grades,
            [solutionId]: grade,
        });
    };

    const handleUpdateGrade = async (solutionId) => {
        const token = localStorage.getItem('token'); // Get auth token from local storage
        const gradeData = { finalGrade: grades[solutionId] }; // Get the grade from state

        try {
            const response = await fetch(`http://localhost:8080/api/solutions/update-final-grade/${solutionId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(gradeData)
            });

            if (response.ok) {
                const responseText = await response.text(); // Get the response as text
                const data = responseText ? JSON.parse(responseText) : {}; // Parse the JSON if not empty
                console.log('Grade updated successfully:', data); // Log the response
            } else {
                const errorMsg = await response.text();
                console.error('Failed to update grade:', errorMsg);
            }
        } catch (error) {
            console.error('Error updating grade:', error);
        }
    };

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
                            <th className="px-4 py-2 text-left">Report ID</th>
                            <th className="px-4 py-2 text-left">Time Start</th>
                            <th className="px-4 py-2 text-left">Time End</th>
                            <th className="px-4 py-2 text-left">Grade</th>
                            <th className="px-4 py-2 text-left">Cheating Rate</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.length > 0 ? (
                            solutions.map((solution, index) => (
                                <tr key={index} className="bg-gray-700 border-b">
                                    <td className="px-4 py-2">{solution.ID}</td>
                                    <td className="px-4 py-2">{solution.ReportID}</td>
                                    <td className="px-4 py-2">{formatDateTime(solution.TimeStart)}</td>
                                    <td className="px-4 py-2">{formatDateTime(solution.TimeEnd)}</td>
                                    <td className="px-4 py-2">
                                        <input 
                                            type="number" 
                                            value={grades[solution.ID] || 0} 
                                            onChange={(e) => handleGradeChange(solution.ID, parseInt(e.target.value, 10))} 
                                            className="bg-gray-600 text-white p-2 rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        {cheatingRates[solution.ID] !== undefined ? cheatingRates[solution.ID] : 0}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button 
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleUpdateGrade(solution.ID)}
                                        >
                                            Update Grade
                                        </button>
                                        <button 
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                                            onClick={() => handleGenerateReport(solution.ID)}
                                        >
                                            Generate Cheating Rate
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4">
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
