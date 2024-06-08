import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';

const Profile = () => {
    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');  // Assuming the token is stored in localStorage
            try {
                const response = await fetch('http://localhost:8080/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Add your token in the request headers
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    console.log("Profile Data:", data);  // Log the data to the console
                    localStorage.setItem("roleID", data.RoleID)
                    localStorage.setItem("id", data.ID)
                } else {
                    throw new Error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        console.log("User logged out");
        localStorage.removeItem('token');
        window.location.href = '/login';  // Redirect to login page
    };

    const getRoleName = (roleId) => {
        switch (roleId) {
            case 1:
                return 'Student';
            case 2:
                return 'Teacher';
            case 3:
                return 'Admin';
            default:
                return 'Unknown';  // Fallback for unknown RoleID
        }
    };

    if (!userData) {
        return <div>Loading profile data...</div>;
    }

    return (
        <div className="flex">
            <Navbar />
            <div className="container mx-auto p-4 max-w-md">
                <div className="flex justify-center">
                <h1 className="text-xl font-bold text-white">Profile</h1>
                </div>
                <div className="mb-2">
                    <label className="block text-white text-sm font-bold mb-2">Name</label>
                    <div className="p-3 bg-gray-700 rounded">{userData.Name}</div>
                </div>
                <div className="mb-2">
                    <label className="block text-white text-sm font-bold mb-2">Surname</label>
                    <div className="p-3 bg-gray-700 rounded">{userData.Surname}</div>
                </div>
                <div className="mb-2">
                    <label className="block text-white text-sm font-bold mb-2">Email</label>
                    <div className="p-3 bg-gray-700 rounded">{userData.Email}</div>
                </div>
                <div className="mb-4">
                    <label className="block text-white text-sm font-bold mb-2">Role</label>
                    <div className="p-3 bg-gray-700 rounded">{getRoleName(userData.RoleID)}</div>
                </div>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Profile;
