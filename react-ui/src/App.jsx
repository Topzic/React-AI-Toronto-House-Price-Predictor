/* eslint-disable no-unused-vars */
// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Routes from react-router-dom
import Home from './Home.jsx';
import Nav from './Navigation.jsx';
import Prediction from './Prediction.jsx';
import PredictionList from './PredictionList.jsx';

function App() {
  return (
    <Router>
      <div>
        <Nav />
        <Routes> {/* Wrap your routes with Routes */}
          <Route exact path="/" element={<Home />} /> {/* Use element prop with JSX element */}
          <Route exact path="/home" element={<Home />} /> {/* Use element prop with JSX element */}
          <Route path="/prediction" element={<Prediction />} /> {/* Use element prop with JSX element */}
          <Route path="/list" element={<PredictionList />} /> {/* Use element prop with JSX element */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
