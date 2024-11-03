import React, { useContext } from 'react'
import AuthContext from '../../AuthContext';

const Signup = () => {
    let {signup} = useContext(AuthContext);

    const handleSignup = async (e) => {
        e.preventDefault();
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            dob: document.getElementById('dob').value,
            education: document.getElementById('education').value,
            gender : document.getElementById('gender').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            post: document.getElementById('post').value,
            department: document.getElementById('department').value,
            specialization: document.getElementById('specialization').value,
            password: document.getElementById('password').value
        }
        if(await signup(data, document.getElementById('userType').value)) {
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    }

  return (
    <div>
      <h1>Signup</h1>
        <form onSubmit={handleSignup}>
            <select id='userType'>
                <option value="patients">Patient</option>
                <option value="doctor">Doctor</option>
            </select>
            <input id='firstName' type="text" placeholder="First Name" />
            <input id='lastName' type="text" placeholder="Last Name" />
            <input id = 'dob' type = "date" placeholder = "Date of Birth"/>
            <input id = 'education' type = 'text' placeholder='Education'/>
            <select id = 'gender'>
                <option value = "M">Male</option>
                <option value = "F">Female</option>
            </select>
            <input id = 'phone' type = 'text' placeholder = 'Phone'/>
            <input id='email' type="text" placeholder="Email" />
            <input id = 'post' type = 'text' placeholder = 'Post'/>
            <input id = 'department' type = 'text' placeholder='Department'/>
            <input id = 'specialization' type = 'text' placeholder='Specialization'/>
            <input id='password' type="password" placeholder="Password" />
            <button type="submit">Signup</button>
        </form>
    </div>
  )
}

export default Signup
