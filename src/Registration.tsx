import React from 'react';
import {Header} from './Home';
import gsslLogo from './assets/gssl-logo.jpg';
import './RegistrationForm.css';


function RegistrationForm(){

    const handleSubmit = (e) =>{
        e.preventDefault();
        // Handle form submission logic here
        alert('Registration submitted!');
    }

    return (
        <div className="registration-form">
            <h2>Player Registration</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input type="text" className="playerName" name="name" required />
                <label htmlFor="name">Mobile Number:</label>
                <input type="number" className="playerName" name="name" required />
           
                <label htmlFor="name">City:</label>
                <select name="city" className="citySelect" required>
                    <option value="">Select City</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="rawalpindi">Rawalpindi</option>
                </select>
                <label htmlFor="name">Player Type:</label>
               <div className="playerType">
                 <input type="radio" name="playerType" value="batsman" required /> Batsman
                <input type="radio" name="playerType" value="bowler" required /> Bowler
                <input type="radio" name="playerType" value="allrounder" required /> All-Rounder
            
               </div>

               <label htmlFor="name">Upload Picture:</label>
               <div className="fileUpload">
                <input type="file" name="picture" accept="image/*" required />
               </div>

               <label htmlFor="name">Upload CNIC:</label>
               <div className="fileUpload">
                <input type="file" name="picture" accept="image/*" required />
               </div>

               <label htmlFor="name">Upload Payment Receipt:</label>
               <div className="fileUpload">
                <input type="file" name="picture" accept="image/*" required />
               </div>

               <button type="submit" className="submitButton">Submit Registration</button>

            </form>
        </div>
    );
}

export const RegistrationComponent = () => {
    return (
        <div>
            <Header/>
            <div className="row">
                <div className="registration-col">
                    <RegistrationForm/>
                </div>
                <div className="tournament-logo-col">
                        <img src={gsslLogo} alt="GSSL Logo" className="gssl-logo" />
                        <h3>Golra Station Super League 2026</h3>
                        <p>Register now to participate in the upcoming season!</p>
                    </div>
            </div>
        </div>
    );
}