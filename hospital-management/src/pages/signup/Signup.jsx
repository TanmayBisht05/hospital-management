import React, { useContext } from 'react'
import AuthContext from '../../AuthContext';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import './signup.css';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    let {signup, formattedDate} = useContext(AuthContext);
    const navigate = useNavigate();
    const handleSignup = async (e) => {
        e.preventDefault();
        const data = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            NTK: document.getElementById('NTK').value,
            dob: document.getElementById('dob').value,
            gender : document.getElementById('gender').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }
        if(await signup(data, "patients")) {
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    }

  return (
    <div>
        <Navbar />
        <Fake />
        <div className="login_div">
            <h1>Signup</h1>
            <form className='login_form_horizontal' onSubmit={handleSignup}>
                <div className="login_form_left">
                    <div className="login_div">
                        <label htmlFor="firstName" className="login_label">First Name : </label>
                        <input className='login_input' id='firstName' type="text" placeholder="First Name" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="lastName" className="login_label">Last Name : </label>
                        <input className='login_input' id='lastName' type="text" placeholder="Last Name" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="dob" className="login_label">Date of Birth : </label>
                        <input className='login_input' id='dob' type="date" placeholder="Date of Birth" max={formattedDate(new Date())} required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="address" className="login_label">Address : </label>
                        <input type="text" className="login_input" placeholder='Address' id='address' />
                    </div>
                </div>
                <div className="login_form_right">
                    <div className="login_div">
                        <label htmlFor="NTK" className="login_label">NTK : </label>
                        <input type="text" className="login_input" placeholder='NTK' id='NTK' />
                    </div>
                    <div className="login_div">
                        <label htmlFor="gender" className="login_label">Gender : </label>
                        <select className='login_select' id = 'gender'>
                            <option value = "M">Male</option>
                            <option value = "F">Female</option>
                        </select>
                    </div>
                    <div className="login_div">
                        <label htmlFor="email" className="login_label">Email : </label>
                        <input className='login_input' id='email' type="text" placeholder="Email" required />
                    </div>
                    <div className="login_div">
                        <label htmlFor="password" className="login_label">Password : </label>
                        <input className='login_input' id='password' type="password" placeholder="Password" required />
                    </div>
                    <button className='login_button' type="submit">Signup</button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Signup
