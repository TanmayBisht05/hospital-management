import React, { useContext } from 'react'
import AuthContext from '../../AuthContext';
import Navbar from '../../components/navbar/navbar';
import Fake from '../../utility/Fake';
import './signup.css';
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
            <form className='login_form' onSubmit={handleSignup}>
                {/* <div className="login_div">
                    <label htmlFor="userType" className="login_label">Who are you? : </label>
                    <select className='login_select' id='userType'>
                        <option value="patients">Patient</option>
                        <option value="doctor">Doctor</option>
                    </select>
                </div> */}
                <div className="login_div">
                    <label htmlFor="firstName" className="login_label">First Name : </label>
                    <input className='login_input' id='firstName' type="text" placeholder="First Name" />
                </div>
                <div className="login_div">
                    <label htmlFor="lastName" className="login_label">Last Name : </label>
                    <input className='login_input' id='lastName' type="text" placeholder="Last Name" />
                </div>
                <div className="login_div">
                    <label htmlFor="dob" className="login_label">Date of Birth : </label>
                    <input className='login_input' id='dob' type="date" placeholder="Date of Birth" />
                </div>
                <div className="login_div">
                    <label htmlFor="education" className="login_label">Education : </label>
                    <input className='login_input' id='education' type="text" placeholder="Education" />
                </div>
                <div className="login_div">
                    <label htmlFor="gender" className="login_label">Gender : </label>
                    <select className='login_select' id = 'gender'>
                        <option value = "M">Male</option>
                        <option value = "F">Female</option>
                    </select>
                </div>
                <div className="login_div">
                    <label htmlFor="phone" className="login_label">Phone : </label>
                    <input className='login_input' id = 'phone' type = 'text' placeholder = 'Phone'/>
                </div>
                <div className="login_div">
                    <label htmlFor="email" className="login_label">Email : </label>
                    <input className='login_input' id='email' type="text" placeholder="Email" />
                </div>
                <div className="login_div">
                    <label htmlFor="post" className="login_label">Post : </label>
                    <input className='login_input' id = 'post' type = 'text' placeholder = 'Post'/>
                </div>
                <div className="login_div">
                    <label htmlFor="department" className="login_label">Department : </label>
                    <input className='login_input' id = 'department' type = 'text' placeholder='Department'/>
                </div>
                <div className="login_div">
                    <label htmlFor="specialization" className="login_label">Specialization : </label>
                    <input className='login_input' id = 'specialization' type = 'text' placeholder='Specialization'/>
                </div>
                <div className="login_div">
                    <label htmlFor="password" className="login_label">Password : </label>
                    <input className='login_input' id='password' type="password" placeholder="Password" />
                </div>
                <button className='login_button' type="submit">Signup</button>
            </form>
        </div>
    </div>
  )
}

export default Signup
