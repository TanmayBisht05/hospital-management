import React, { useState } from 'react';
import Navbar from '../components/navbar/navbar';
import Footer from '../components/footer';
import Fake from '../utility/Fake';
import './contact.css';

const Contact = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [ph, setPh] = useState('');
    const [gender, setGender] = useState('');
    const [weight, setWeight] = useState('');
    const [problemInfo, setProblemInfo] = useState('');
    const [problemType, setProblemType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <>
        <Fake />
        <div className='contact-bod'>
            <form onSubmit={handleSubmit} className='contact-form'>
                <label className='contact-label'>
                    Name:
                    <input className='contact-inp' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <br />
                <label className='contact-label'>
                    Age:
                    <input className='contact-inp' type="number" value={age} onChange={(e) => setAge(e.target.value)} />
                </label>
                <br />
                <label className='contact-label'>
                     Phone Number:
                    <input className='contact-inp' type="number" value={ph} onChange={(e) => setPh(e.target.value)} />
                </label>
                <br />
                <label className='contact-label'>
                    Gender:
                    <input className='contact-inp' type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                </label>
                <br />
                <label className='contact-label'>
                    Weight:
                    <input className='contact-inp' type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
                </label>
                <br />
                <label className='contact-label'>
                    Problem Information:
                    <textarea className='contact-inp' value={problemInfo} onChange={(e) => setProblemInfo(e.target.value)} />
                </label>
                <br />
                <label className='contact-label'>
                    Problem Type:
                    <select className='contact-inp' value={problemType} onChange={(e) => setProblemType(e.target.value)}>
                        <option value="">Select problem type</option>
                        <option value="gynae">Gynecology</option>
                        <option value="ent">ENT</option>
                    </select>
                </label>
                <br />
                <button className='contact-but' type="submit">Submit</button>
            </form>
        </div>
        </>
    );
};

export default Contact;