import React, { useState } from "react";
import { Link } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    RoleID: 2 // Default RoleID for 'student'
  });

  const roleMapping = {
    student: 2,
    teacher: 1,
    admin: 3
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData({ ...formData, RoleID: roleMapping[value] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    console.log(formData)
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          password: formData.password,
          RoleID: formData.RoleID
        })
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        // Optionally, redirect the user or show a success message
      } else {
        throw new Error('Failed to sign up.');
      }
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0">
      <div className="md:w-1/3 max-w-sm">
        <h1 className="lg:text-2xl text-center p-2 text-gray-800 font-bold">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit}>
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="text"
            placeholder="Surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
            name="role"
            value={Object.keys(roleMapping).find(key => roleMapping[key] === formData.RoleID)}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <div className="text-center md:text-left">
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
          Already have an account?{" "}
          <Link
            to="../login"
            className="text-red-600 hover:underline hover:underline-offset-4"
            href="#"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
