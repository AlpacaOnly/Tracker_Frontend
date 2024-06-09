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
                    console.log("solutions", solutions)
                    // Initialize grades and cheating rates state with default values
                    const initialGrades = {};
                    const initialCheatingRates = {};
                    data.forEach(solution => {
                        initialGrades[solution.ID] = solution.FinalGrade;
                        initialCheatingRates[solution.ID] = solution.CheatingResult; // Initialize cheating rate to 0
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

                const refetch = async() => {
                    const data = await fetch(`http://localhost:8080/api/solutions/solved-task/${examid}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }).then(res => res.json()).catch(console.log)

                    const initialGrades = {};
                    const initialCheatingRates = {};
                    data.forEach(solution => {
                        initialGrades[solution.ID] = solution.FinalGrade;
                        initialCheatingRates[solution.ID] = solution.CheatingResult; // Initialize cheating rate to 0
                    });
                    setGrades(initialGrades);
                    setCheatingRates(initialCheatingRates);
                }

                refetch().catch(console.log);
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
        console.log(`Updated CheatingRate for solution ${solutionId} to ${cheatingRate}`); // Log to verify the update
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

    const fetchSolutionsByStudent = async (studentId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8080/api/solutions/by-student/${studentId}`, {
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
                            <th className="px-4 py-2 text-left">Report ID</th>
                            <th className="px-4 py-2 text-left">Solution</th>
                            <th className="px-4 py-2 text-left">Grade</th>
                            <th className="px-4 py-2 text-left">Cheating Rate</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {solutions.length > 0 ? (
                            solutions.map((solution, index) => (
                                <tr key={index} className="bg-gray-700 border-b">
                                    <td className="px-4 py-2">{solution.ReportID}</td>
                                    <td className="px-4 py-2">{solution.Solution}</td>
                                    <td className="px-4 py-2">
                                        <input 
                                            type="number" 
                                            value={grades[solution.ID]}
                                            onChange={(e) => handleGradeChange(solution.ID, e.target.value)}
                                            className="bg-gray-600 text-white p-2 rounded w-16" // Adjusted width
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
