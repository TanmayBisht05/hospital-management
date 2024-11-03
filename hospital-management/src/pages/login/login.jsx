import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // Create URL-encoded request parameters
        const params = new URLSearchParams();
        params.append('email', email);
        params.append('password', password);
        params.append('userType', userType);

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(), // Send as URL-encoded
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                // Handle success (e.g., save token,k redirect)
            } else {
                console.error('Login failed:', data);
                // Handle error (e.g., show message)
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    required
                >
                    <option value="">Select User Type</option>
                    <option value="PATIENT">Patient</option>
                    <option value="DOCTOR">Doctor</option>
                </select>
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
