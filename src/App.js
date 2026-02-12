import React, { useState } from "react";
import axios from "axios";

function App() {
  const API = "http://backendform-env.eba-wfb2syjm.eu-north-1.elasticbeanstalk.com";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Toggle View Users
  const handleViewUsers = async () => {
    if (!showUsers) {
      await fetchUsers();
    }
    setShowUsers(!showUsers);
  };

  // Submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(`${API}/users/${editingId}`, formData);
        setMessage("User updated successfully");
        setEditingId(null);
      } else {
        await axios.post(`${API}/signup`, formData);
        setMessage("User registered successfully");
      }

      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
      });

      if (showUsers) fetchUsers();

    } catch (error) {
      setMessage("Operation failed");
    }
  };

  // Delete User
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/users/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  // Edit User
  const handleEdit = (user) => {
    setFormData({
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      password: user.password,
    });
    setEditingId(user.id);
  };

 return (
  <div className="container-fluid min-vh-100 py-5">
    <div className="row justify-content-center">

      {/* LEFT SIDE - SIGNUP FORM */}
      <div className="col-md-5">
        <div className="card shadow-lg p-4 text-white h-100"
             style={{ backgroundColor: "#000" }}>

          <h2 className="text-center mb-4">
            {editingId ? "Edit User" : "Signup Form"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                name="fullName"
                className="form-control"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="tel"
                name="mobile"
                className="form-control"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update User" : "Sign Up"}
            </button>
          </form>

          {message && (
            <div className="alert alert-success mt-3 text-center">
              {message}
            </div>
          )}

          <p
            className="text-center mt-4 text-info"
            style={{ cursor: "pointer" }}
            onClick={handleViewUsers}
          >
            {showUsers ? "Hide Registered Users" : "View Registered Users"}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - USERS */}
      {showUsers && (
        <div className="col-md-6 ms-4">
          <div className="card shadow-lg p-4 text-white"
               style={{ backgroundColor: "#111" }}>

            <h4 className="text-center mb-4">Registered Users</h4>

            {users.map((user) => (
              <div key={user.id}
                   className="card mb-3 p-3 bg-dark text-white">

                <h6>👤 {user.fullName}</h6>
                <p className="mb-1">📧 {user.email}</p>
                <p className="mb-2">📱 {user.mobile}</p>

                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  </div>
);

}

export default App;
