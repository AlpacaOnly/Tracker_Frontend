import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Login = () => {
    let navigate = useNavigate();
    const handleLogin = (event) => {
        event.preventDefault();
        // Here, insert authentication logic. After successful login:
        navigate("/home"); // Redirects user to the Home page
    };
  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      
      <div className="md:w-1/3 max-w-sm">
        
      <h1 className="lg:text-2xl text-center p-2 text-gray-800 font-bold">
          Login
        </h1>
        <form onSubmit={handleLogin}
        >
            <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
          type="text"
          placeholder="Email Address"
        />
        <input
          className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
          type="password"
          placeholder="Password"
        />
        <div className="mt-4 flex justify-between font-semibold text-sm">
          <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer">
            <input className="mr-1" type="checkbox" />
            <span>Remember Me</span>
          </label>
          <a
            className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4"
            href="#"
          >
            Forgot Password?
          </a>
        </div>
        <div className="text-center md:text-left">
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
            type="submit"
          >
            Login
          </button>
        </div>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Don&apos;t have an account?{" "}
          <Link
          to="/signup"
            className="text-red-600 hover:underline hover:underline-offset-4"
          >
            Register
          </Link>
        </div>
        </form>
        
      </div>
    </section>
  );
};

export default Login;