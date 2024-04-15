/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

function Nav() {
  return (
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
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
