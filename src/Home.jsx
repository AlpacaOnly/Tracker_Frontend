// Home.jsx
import React from "react";
import Navbar from "./Navbar";

const Home = () => {
    return (
        <div className="flex">
        <Navbar/>
        <div className="p-10">
            <h1 className="font-bold text-3xl mb-3">Welcome to the Educational Portal</h1>
            <p>This is the home page. Navigation through the portal is available via the sidebar.</p>
        </div>
        </div>
    );
};

export default Home;
