

/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Prediction() {
  const [formData, setFormData] = useState({
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    parking: '',
    houseType: '',
    lat: '',
    long: ''
  });
  const [predictionData, setPredictionData] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "http://localhost:5000/run";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log("Submitted...");
    e.preventDefault();
    setShowLoading(true);
    try {
      const result = await axios.get(apiUrl, {
        params: formData
      });
      console.log(result);
      setPredictionData(result.data.prediction);
    } catch (error) {
      console.log('error in handleSubmit:', error);
    }
    setShowLoading(false);
  };

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col">
          <h2>House Price Predictor</h2>
          <hr />

          {showLoading && (
            <Spinner className='mt-3' animation="border" role="status">
              <span className='mt-3'></span>
            </Spinner>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Bedrooms:</label>
                  <input type="number" className="form-control" name="bedrooms" value={formData.bedrooms} required onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Bathrooms:</label>
                  <input type="number" className="form-control" name="bathrooms" value={formData.bathrooms} required onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Sqft:</label>
                  <input type="number" className="form-control" name="sqft" value={formData.sqft} required onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Parking:</label>
                  <input type="number" className="form-control" name="parking" value={formData.parking} required onChange={handleChange} />
                </div>
              </div>

            </div>
            <div className="row">
            <div className="col-md-6">
                <div className="form-group">
                  <label>Latitude:</label>
                  <input type="number" className="form-control" name="lat" value={formData.lat} required onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Longitude:</label>
                  <input type="number" className="form-control" name="long" value={formData.long} required onChange={handleChange} />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>House Type:</label>
                  <input type="number" className="form-control" name="houseType" value={formData.houseType} required onChange={handleChange} />
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">Predict</button>
          </form>

          <div className="mt-3">
            {predictionData ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>House Price Prediction Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${parseFloat(predictionData).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p>No prediction data available</p>
            )}
          </div>
        </div>

        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>House Type</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Condo Apt</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Semi-Detached</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Detached</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Condo Townhouse</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Duplex</td>
                <td>4</td>
              </tr>
              <tr>
                <td>Att/Row/Twnhouse</td>
                <td>5</td>
              </tr>
              <tr>
                <td>Co-Ownership Apt</td>
                <td>6</td>
              </tr>
              <tr>
                <td>Link</td>
                <td>7</td>
              </tr>
              <tr>
                <td>Comm Element Condo</td>
                <td>8</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Prediction;