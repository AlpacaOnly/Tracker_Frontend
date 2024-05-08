import React from 'react';
import Navbar from './Navbar';

// Simulated user data
const userData = {
    name: "John",
    surname: "Doe",
    gpa: 3.8,
    groupNumber: "101"
};

const Profile = () => {
    const handleLogout = () => {
        // Here you would usually handle the logout logic,
        // like clearing the user's session or token.
        console.log("User logged out");
        // Redirect to login page or another appropriate action
        // window.location.href = '/login'; // Uncomment and adjust as necessary
    };

    return (
        <div className="flex">
        <Navbar/>
        <div className="container mx-auto p-4 max-w-md">
            
            <h1 className="text-xl font-bold text-gray-800 mb-4">Profile</h1>
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <div className="p-3 bg-gray-100 rounded">{userData.name}</div>
            </div>
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">Surname</label>
                <div className="p-3 bg-gray-100 rounded">{userData.surname}</div>
            </div>
            <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">GPA</label>
                <div className="p-3 bg-gray-100 rounded">{userData.gpa}</div>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Group Number</label>
                <div className="p-3 bg-gray-100 rounded">{userData.groupNumber}</div>
            </div>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Logout
            </button>
        </div>
        </div>
    );
};

export default Profile;
