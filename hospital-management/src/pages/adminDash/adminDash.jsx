import React, { useState } from 'react';

function AdminDash() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        education: '',
        gender: '',
        phone: '',
        email: '',
        post: '',
        department: '',
        specialization: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const result = await response.json();
            console.log(result);

            setFormData({
                firstName: '',
                lastName: '',
                dob: '',
                education: '',
                gender: '',
                phone: '',
                email: '',
                post: '',
                department: '',
                specialization: '',
                password: ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>AdminDash</h1>
            <div className="doctor-registration">
                <h2>Doctor Registration</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            maxLength="50"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            maxLength="50"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Education:
                        <input
                            type="text"
                            name="education"
                            maxLength="100"
                            value={formData.education}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Gender:
                        <input
                            type="text"
                            name="gender"
                            maxLength="10"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Phone:
                        <input
                            type="text"
                            name="phone"
                            maxLength="15"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Post:
                        <input
                            type="text"
                            name="post"
                            maxLength="50"
                            value={formData.post}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Department:
                        <input
                            type="text"
                            name="department"
                            maxLength="50"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Specialization:
                        <input
                            type="text"
                            name="specialization"
                            maxLength="50"
                            value={formData.specialization}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
}

export default AdminDash;
