import React from 'react';

import {useCookies} from "react-cookie";


const Calculation = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)

    const signOut = () => {
        console.log('signout')
        removeCookie('Email')
        removeCookie('AuthToken')
        window.location.reload()

    }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const digits = event.target.digits.value;

        try {
            // Use fetch to send a request to the backend
            const response = await fetch('http://localhost:8000/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ digits }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle successful response data
            const data = await response.json();
            console.log(data);
        } catch (error) {
            // Handle errors
            console.error('Error:', error);
        }
    };
    const handleHistory = async () => {
        // Use fetch or Axios to send a request to get calculation history
        const response = await fetch('http://localhost:8000/history');

        // Handle the response and display the history as needed
        const history = await response.json();
        console.log(history);
    };

    return (
        <>
            <div className="app">
            <div className="button-container">
                <button className="button" onClick={signOut}>SIGN OUT</button>
                <button className="button" onClick={handleHistory}>HISTORY</button>
            </div>
            <form className="calc_form" onSubmit={handleSubmit} method="post">
                <div className="input-group">
                    <label htmlFor="digits">Enter the number of digits:</label>
                    <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
                    <div className="button-container">
                        <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
                        <button className="button" type="submit" >CANCEL CALCULATION</button>
                    </div>
                </div>
            </form>
            <form className="calc_form" onSubmit={handleSubmit} method="post">
                <div className="input-group">
                    <label htmlFor="digits">Enter the number of digits:</label>
                    <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
                    <div className="button-container">
                        <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
                        <button className="button" type="submit">CANCEL CALCULATION</button>
                    </div>
                </div>
            </form>
            <form className="calc_form"  method="post">
                <div className="input-group">
                    <label htmlFor="digits">Enter the number of digits:</label>
                    <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>

                    <div className="button-container">
                        <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
                        <button className="button" type="submit">CANCEL CALCULATION</button>
                    </div>
                </div>
            </form>
            <form className="calc_form"  method="post">
                <div className="input-group">
                    <label htmlFor="digits">Enter the number of digits:</label>
                    <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>

                    <div className="button-container">
                        <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
                        <button className="button" type="submit">CANCEL CALCULATION</button>
                    </div>
                </div>
            </form>
            <form className="calc_form"  method="post">
                <div className="input-group">
                    <label htmlFor="digits">Enter the number of digits:</label>
                    <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>

                    <div className="button-container">
                        <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
                        <button className="button" type="submit">CANCEL CALCULATION</button>
                    </div>
                </div>
            </form>
            </div>
        </>
    );
}

export default Calculation;
//
// import React, { useState } from 'react';
// import axios from 'axios';
// import {useCookies} from "react-cookie";
//
// const Calculation = () => {
//     const [digits, setDigits] = useState('');
//     const [cookies, setCookie, removeCookie] = useCookies(null)
//     const handleStartCalculation = async () => {
//         try {
//             const response = await axios.post('/calculate', { digits: parseInt(digits) });
//             console.log('Calculation started:', response.data);
//         } catch (error) {
//             console.error('Error starting calculation:', error.message);
//         }
//     };
//
//     const handleCancelCalculation = async (id) => {
//         try {
//             await axios.post(`/cancel/${id}`);
//             console.log('Calculation canceled');
//         } catch (error) {
//             console.error('Error canceling calculation:', error.message);
//         }
//     };
//
//     const handleHistory = async () => {
//         try {
//             const response = await axios.get('/history');
//             console.log('Calculation history:', response.data);
//         } catch (error) {
//             console.error('Error fetching history:', error.message);
//         }
//     };
//
//     const signOut = () => {
//         console.log('signout')
//         removeCookie('Email')
//         removeCookie('AuthToken')
//         window.location.reload()
//
//     }
//
//     return (
//         <>
//             <div className="app">
//                 <div className="button-container">
//                     <button className="button" onClick={signOut}>SIGN OUT</button>
//                     <button className="button" onClick={handleHistory}>
//                         HISTORY
//                     </button>
//                 </div>
//                 <form className="calc_form"  method="post">
//                     <div className="input-group">
//                         <label htmlFor="digits">Enter the number of digits:</label>
//                         <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//                         <div className="button-container">
//                             <button className="button" onClick={handleStartCalculation}>
//                                 START CALCULATION
//                             </button>
//                             <button className="button" onClick={() => handleCancelCalculation(/* pass calculation ID */)}>
//                                 CANCEL CALCULATION
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//                 <form className="calc_form"  method="post">
//                     <div className="input-group">
//                         <label htmlFor="digits">Enter the number of digits:</label>
//                         <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//                         <div className="button-container">
//                             <button className="button" onClick={handleStartCalculation}>
//                                 START CALCULATION
//                             </button>
//                             <button className="button" onClick={() => handleCancelCalculation(/* pass calculation ID */)}>
//                                 CANCEL CALCULATION
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//                 <form className="calc_form"  method="post">
//                     <div className="input-group">
//                         <label htmlFor="digits">Enter the number of digits:</label>
//                         <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//
//                         <div className="button-container">
//                             <button className="button" onClick={handleStartCalculation}>
//                                 START CALCULATION
//                             </button>
//                             <button className="button" onClick={() => handleCancelCalculation(/* pass calculation ID */)}>
//                                 CANCEL CALCULATION
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//                 <form className="calc_form"  method="post">
//                     <div className="input-group">
//                         <label htmlFor="digits">Enter the number of digits:</label>
//                         <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//
//                         <div className="button-container">
//                             <button className="button" onClick={handleStartCalculation}>
//                                 START CALCULATION
//                             </button>
//                             <button className="button" onClick={() => handleCancelCalculation(/* pass calculation ID */)}>
//                                 CANCEL CALCULATION
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//                 <form className="calc_form"  method="post">
//                     <div className="input-group">
//                         <label htmlFor="digits">Enter the number of digits:</label>
//                         <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//
//                         <div className="button-container">
//                             <button className="button" onClick={handleStartCalculation}>
//                                 START CALCULATION
//                             </button>
//                             <button className="button" onClick={() => handleCancelCalculation(/* pass calculation ID */)}>
//                                 CANCEL CALCULATION
//                             </button>
//                         </div>
//                     </div>
//                 </form>
//             </div>
//
//         </>
//     );
// };
//
// export default Calculation;
