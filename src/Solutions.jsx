import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Solutions = () => {
    const { examid } = useParams(); // Get the task ID from the URL parameters
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Get auth token from local storage

        // Fake data for testing
        const fakeSolutions = [
            {
                studentId: 1,
                solutionText: "function solution() { return 'Hello World'; }"
            },
            {
                studentId: 2,
                solutionText: "function add(a, b) { return a + b; }"
            },
            {
                studentId: 3,
                solutionText: "const message = 'This is a test solution'; console.log(message);"
            }
        ];

        const fetchSolutions = async () => {
            try {
                // Simulating a delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Normally, you would fetch data from the server here
                // const response = await fetch(`http://localhost:8080/api/solutions/solved-task/${examid}`, {
                //     headers: {
                //         'Authorization': `Bearer ${token}`,
                //         'Content-Type': 'application/json'
                //     }
                // });

                // if (response.ok) {
                //     const data = await response.json();
                //     setSolutions(data); // Update state with fetched solutions data
                // } else {
                //     const errorMsg = await response.text();
                //     throw new Error(errorMsg || 'Failed to fetch solutions');
                // }

                // Using fake data for now
                setSolutions(fakeSolutions);
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
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold text-white mb-4">Solutions for Task {examid}</h1>
            <table className="min-w-full table-auto">
                <thead className="bg-gray-800">
                    <tr>
                        <th className="px-4 py-2 text-left">Student ID</th>
                        <th className="px-4 py-2 text-left">Solution</th>
                    </tr>
                </thead>
                <tbody>
                    {solutions.length > 0 ? (
                        solutions.map((solution) => (
                            <tr key={solution.studentId} className="bg-gray-700 border-b">
                                <td className="px-4 py-2">{solution.studentId}</td>
                                <td className="px-4 py-2">
                                    <pre>{solution.solutionText}</pre>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="2" className="text-center py-4">
                                No solutions available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Solutions;
