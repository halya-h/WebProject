import React, { useState } from 'react';
import { useCookies } from "react-cookie";

const Calculation = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [results, setResults] = useState(Array(5).fill(null));
    const [cancelTokens, setCancelTokens] = useState(Array(5).fill(null).map(() => new AbortController()));
    const [cancelMessages, setCancelMessages] = useState(Array(5).fill(null));
    const signOut = () => {
        removeCookie('Email');
        removeCookie('AuthToken');
        window.location.reload();
    };

    const handleSubmit = async (event, formIndex) => {
        event.preventDefault();
        const digits = event.target.digits.value;
        if (isNaN(digits) || digits <= 0) {
            console.error("Invalid input for digits");
            return;
        }

        const cancelToken = new AbortController();
        setCancelTokens((prevTokens) => {
            const newTokens = [...prevTokens];
            newTokens[formIndex] = cancelToken;
            return newTokens;
        });


        try {
            const response = await fetch('http://localhost:8000/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                signal: cancelToken.signal,
                body: JSON.stringify({ initialValue: digits }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResults((prevResults) => {
                const newResults = [...prevResults];
                newResults[formIndex] = data.result;
                return newResults;
            });
        } catch (error) {
            // Check if the error is an AbortError
            if (error.name === 'AbortError') {
                console.log('Calculation canceled');
                setCancelMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[formIndex] = 'Calculation canceled';
                    return newMessages;
                });
            } else {
                // Log other errors
                console.error('Error during calculation:', error);
            }
        }
    };

        const handleHistory = async () => {
            const response = await fetch('http://localhost:8000/history');
            const history = await response.json();
            console.log(history);
        };

    const handleCancel = async (event, formIndex) => {
        event.preventDefault();
        console.log('Client: Sending cancellation request');

        try {
            // Send a POST request to the server's /cancel endpoint
            const response = await fetch('http://localhost:8000/api/cancel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formIndex }),
            });

            if (response.ok) {
                console.log('Calculation cancelled');
                setCancelMessages((prevMessages) => {
                    const newMessages = [...prevMessages];
                    newMessages[formIndex] = 'Calculation cancelled';
                    return newMessages;
                });
            } else {
                console.error('Failed to cancel calculation:', response.statusText);
            }
        } catch (error) {
            console.error('Error while canceling calculation:', error.message);
        }
    };


    return (
            <>
                <div className="app">
                    <div className="button-container">
                        <button className="button" onClick={signOut}>SIGN OUT</button>
                        <button className="button">HISTORY</button>
                    </div>
                    {[0, 1, 2, 3, 4].map((formIndex) => (
                        <form key={formIndex} className="calc_form" onSubmit={(event) => handleSubmit(event, formIndex)}
                              method="post">
                            <div className="input-group">
                                <label htmlFor="digits">Enter the number of digits:</label>
                                <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
                                <div className="button-container">
                                    <button className="button" type="submit">START CALCULATION</button>
                                    <button className="button" type="button"
                                            onClick={(event) => handleCancel(event, formIndex)}>CANCEL CALCULATION
                                    </button>

                                </div>
                                {results[formIndex] !== null && <div>Result: {results[formIndex]}</div>}
                                {cancelMessages[formIndex] && <div>{cancelMessages[formIndex]}</div>}
                            </div>
                        </form>
                    ))}
                </div>
            </>
        );
    }

    export default Calculation;



// import { useCookies } from "react-cookie";
//
// const Calculation = () => {
//     const [cookies, setCookie, removeCookie] = useCookies(null);
//     const [results, setResults] = useState(Array(5).fill(null)); // Додайте стан для збереження результату
//
//     const signOut = () => {
//         removeCookie('Email');
//         removeCookie('AuthToken');
//         window.location.reload();
//     };
//
//     const handleSubmit = async (event, formIndex) => {
//         event.preventDefault();
//         const digits = event.target.digits.value;
//         if (isNaN(digits) || digits <= 0) {
//             console.error("Invalid input for digits");
//             return;
//         }
//         try {
//             const response = await fetch('http://localhost:8000/api/calculate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({ initialValue: digits }),
//             });
//
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//
//             const data = await response.json();
//             setResults((prevResults) => {
//                 const newResults = [...prevResults];
//                 newResults[formIndex] = data.result;
//                 return newResults;
//             });// Зберігайте результат у стані
//         } catch (error) {
//             console.error('Error parsing JSON:', error);
//         }
//     };
//
//     const handleHistory = async () => {
//         const response = await fetch('http://localhost:8000/history');
//         const history = await response.json();
//         console.log(history);
//     };
//
//     const handleCancel = (event) => {
//         event.preventDefault();
//         console.log('Calculation cancelled');
//         //setResult(null); // Скасовано, скидайте результат
//     };
//
//     return (
//         <>
//             <div className="app">
//             <div className="button-container">
//                 <button className="button" onClick={signOut}>SIGN OUT</button>
//                 <button className="button" onClick={handleHistory}>HISTORY</button>
//             </div>
//             <form className="calc_form" onSubmit={function(event) { handleSubmit(event, 0) }} method="post">
//                 <div className="input-group">
//                     <label htmlFor="digits">Enter the number of digits:</label>
//                     <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//                     <div className="button-container">
//                         <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
//                         <button className="button" type="button" onClick={handleCancel}>CANCEL CALCULATION</button>
//
//                     </div>
//                     {results[0] !== null && <div>Result: {results[0]}</div>}
//                 </div>
//             </form>
//             <form className="calc_form" onSubmit={function(event) { handleSubmit(event, 1) }} method="post">
//                 <div className="input-group">
//                     <label htmlFor="digits">Enter the number of digits:</label>
//                     <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//                     <div className="button-container">
//                         <button className="button" type="submit" onSubmit={handleSubmit}>START CALCULATION</button>
//                         <button className="button" type="button" onClick={handleCancel}>CANCEL CALCULATION</button>
//
//                     </div>
//                     {results[1] !== null && <div>Result: {results[1]}</div>}
//                 </div>
//             </form>
//             <form className="calc_form" onSubmit={function(event) { handleSubmit(event, 2) }} method="post">
//                 <div className="input-group">
//                     <label htmlFor="digits">Enter the number of digits:</label>
//                     <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//
//                     <div className="button-container">
//                         <button className="button" type="submit" >START CALCULATION</button>
//                         <button className="button" type="button" onClick={handleCancel}>CANCEL CALCULATION</button>
//
//                     </div>
//                     {results[2] !== null && <div>Result: {results[2]}</div>}
//                 </div>
//             </form>
//             <form className="calc_form" onSubmit={function(event) { handleSubmit(event, 3) }} method="post">
//                 <div className="input-group">
//                     <label htmlFor="digits">Enter the number of digits:</label>
//                     <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//
//                     <div className="button-container">
//                         <button className="button" type="submit" onSubmit={function(event) { handleSubmit(event, 3) }}>START CALCULATION</button>
//                         <button className="button" type="button" onClick={handleCancel}>CANCEL CALCULATION</button>
//
//                     </div>
//                     {results[3] !== null && <div>Result: {results[3]}</div>}
//                 </div>
//             </form>
//             <form className="calc_form" onSubmit={function(event) { handleSubmit(event, 4) }} method="post">
//                 <div className="input-group">
//                     <label htmlFor="digits">Enter the number of digits:</label>
//                     <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//
//                     <div className="button-container">
//                         <button className="button" type="submit" onSubmit={function(event) { handleSubmit(event, 4) }}>START CALCULATION</button>
//                         <button className="button" type="button" onClick={handleCancel}>CANCEL CALCULATION</button>
//
//                     </div>
//                     {results[4] !== null && <div>Result: {results[4]}</div>}
//                 </div>
//             </form>
//             </div>
//         </>
//     );
// }
// //
// export default Calculation;


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
//
// import React, { useState } from 'react';
// import { useCookies } from "react-cookie";
//
//
// const Calculation = () => {
//     const [cookies, setCookie, removeCookie] = useCookies(null);
//     const [results, setResults] = useState(Array(5).fill(null));
//     const [abortControllers, setAbortControllers] = useState(Array(5).fill(new AbortController()));
//     const [cancelMessage, setCancelMessage] = useState(null);
//
//     const signOut = () => {
//         removeCookie('Email');
//         removeCookie('AuthToken');
//         window.location.reload();
//     };
//
//     const handleSubmit = async (event, formIndex) => {
//         event.preventDefault();
//         const digits = event.target.digits.value;
//         if (isNaN(digits) || digits <= 0) {
//             console.error("Invalid input for digits");
//             return;
//         }
//
//         // Скасувати попередній запит, якщо він ще не завершився
//         abortControllers[formIndex].abort();
//
//         const newAbortController = new AbortController();
//         const signal = newAbortController.signal;
//
//         setAbortControllers((prevAbortControllers) => {
//             const newAbortControllers = [...prevAbortControllers];
//             newAbortControllers[formIndex] = newAbortController;
//             return newAbortControllers;
//         });
//
//         try {
//             const response = await fetch('http://localhost:8000/api/calculate', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 signal, // Pass the AbortSignal to the fetch request
//                 body: JSON.stringify({ initialValue: digits }),
//             });
//
//             if (signal.aborted) {
//                 console.log('Calculation aborted');
//                 return; // Exit the function if the request was aborted
//             }
//
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//
//             const data = await response.json();
//             setResults((prevResults) => {
//                 const newResults = [...prevResults];
//                 newResults[formIndex] = data.result;
//                 return newResults;
//             });
//         } catch (error) {
//             if (signal.aborted) {
//                 console.log('Calculation aborted');
//             } else {
//                 console.error('Error parsing JSON:', error);
//             }
//         }
//     };
//
//
//     const handleCancel = (event, formIndex) => {
//         event.preventDefault();
//         console.log('Calculation cancelled');
//         setCancelMessage('Calculation canceled');
//     };
//
//
//     return (
//         <>
//             <div className="app">
//                 <div className="button-container">
//                     <button className="button" onClick={signOut}>SIGN OUT</button>
//                     <button className="button">HISTORY</button>
//                 </div>
//                 {[0, 1, 2, 3, 4].map((formIndex) => (
//                     <form key={formIndex} className="calc_form" onSubmit={(event) => handleSubmit(event, formIndex)} method="post">
//                         <div className="input-group">
//                             <label htmlFor="digits">Enter the number of digits:</label>
//                             <input className="digits" type="number" name="digits" id="digits" min="1" max="10000"/>
//                             <div className="button-container">
//                                 <button className="button" type="submit">START CALCULATION</button>
//                                 <button className="button" type="button" onClick={(event) => handleCancel(event, formIndex)}>CANCEL CALCULATION</button>
//
//                             </div>
//                             {results[formIndex] !== null && <div>Result: {results[formIndex]}</div>}
//                             {cancelMessage && <div>{cancelMessage}</div>}
//                         </div>
//                     </form>
//                 ))}
//             </div>
//         </>
//     );
// }
//
// export default Calculation;
