import React, { useContext } from 'react'
import AuthContext from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    let {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const data = new URLSearchParams();
        data.append('userType', document.getElementById('userType').value);
        data.append('email', document.getElementById('email').value);
        data.append('password', document.getElementById('password').value);
        if(await login(data)) {
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    }
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
            <select id='userType'>
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
            </select>
            <input id='email' type="text" placeholder="Email" />
            <input id='password' type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default Login
