import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post } from "../services/Api"; // Import the POST helper method
import "../css/Login.css"; // Import the CSS file

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Use the POST helper method to send login data
            const response = await post("/CmsLogin/login", { username, password });

            // Handle success (assuming the response contains a message)
            alert(response.message); // e.g., "Login successful"
            navigate("/sections");
        } catch (error) {
            // Handle errors from the API
            alert(error.message || "Invalid username or password");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username!"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <button className="log-btn" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
