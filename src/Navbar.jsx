import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const roleID = localStorage.getItem("roleID")

    return (
        <div className="h-[calc(100vh-2rem)] top-0 left-0 shadow-lg bg-gray-800 text-white w-64 space-y-6 py-7 px-2 z-10">
            <div className="flex items-center justify-between px-4">
                <a href="#" className="flex items-center">
                    <span className="font-semibold text-lg tracking-wide">Educational Portal</span>
                </a>
                <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-gray-300 md:hidden">
                    <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <nav>
                <Link to="/profile" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Profile</Link>
                <Link to="/grades" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Grades</Link>
                {/* <Link to="/assignments" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Assignments</Link> */}
                <Link to="/examinations" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Examinations</Link>
                <Link to="/results" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">Results</Link>
            </nav>
        </div>
    );
};

export default Navbar;
