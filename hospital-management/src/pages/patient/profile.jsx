import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'; // assuming you are using react-router for navigation
import AuthContext from '../../AuthContext';


const UserDetails = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    let {logout} = useContext(AuthContext);
    const handleLogout = () => {
        logout();
        navigate('/');
    }

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = Cookies.get('token');  // Retrieve token from cookies

                if (!token) {
                    console.error("No token found in cookies");
                    return;
                }

                const response = await axios.get('http://localhost:8080/auth/userinfo', {
                    headers: {
                        Authorization: `${token}`
                    }
                });
                console.error(response)
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserDetails();
    }, []);

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>User Details</h1>
            <p><strong>First Name:</strong> {user.firstName}</p>
            <p><strong>Last Name:</strong> {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User Type:</strong> {user.userType}</p>

            <button onClick={handleLogout} >Logout</button>
        </div>
    );
};

export default UserDetails;
