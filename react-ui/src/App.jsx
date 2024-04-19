/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; 
import Home from './components/Home.jsx';
import Prediction from './components/Prediction.jsx';
import PredictionList from './components/PredictionList.jsx';
import CreateUser from './components/CreateUser.jsx';
import Login from './components/Login.jsx';
import MyPredictions from './components/MyPredictions.jsx'
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';
import RequireAuth from '@auth-kit/react-router/RequireAuth'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'

function App(props) {
  
  let navigate = useNavigate()
  const isAuthenticated = useIsAuthenticated()
  
  const signOut = useSignOut();
  const handleSignOut = () => {
    signOut(); // Perform sign out action
    navigate('/login'); // Navigate to the login page after signing out
  };

  return (
    <>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <Link className="navbar-brand" to="/">House Price Predictor</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/prediction">Prediction</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/list">List Prediction</Link>
                </li>
                {!isAuthenticated ? (
                  <>                  
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/registration">Registration</Link>
                  </li>
                  </>
                  ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/my-predictions">My Predictions</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" onClick={() => handleSignOut()}>Logout</Link>
                    </li>
                  </>
                  )}
              </ul>
            </div>
          </div>
        </nav>
      </div>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          
          <Route path="/prediction" element={ 
            <RequireAuth fallbackPath={'/login'}>
                  <Prediction/>
            </RequireAuth>
          }/>

          <Route path="/my-predictions" element={ 
            <RequireAuth fallbackPath={'/login'}>
                  <MyPredictions/>
            </RequireAuth>
          }/>

          <Route path="/list" element={<PredictionList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registration" element={<CreateUser />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
