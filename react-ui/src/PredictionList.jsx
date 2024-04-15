/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';
import { Form, Col, Row } from 'react-bootstrap';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function PredictionList() {
  const [predictionData, setPredictionData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minBedrooms, setMinBedrooms] = useState('');
  const [maxBedrooms, setMaxBedrooms] = useState('');
  const [minBathrooms, setMinBathrooms] = useState('');
  const [maxBathrooms, setMaxBathrooms] = useState('');
  const [minSqft, setMinSqft] = useState('');
  const [maxSqft, setMaxSqft] = useState('');
  const [minParking, setMinParking] = useState('');
  const [maxParking, setMaxParking] = useState('');

  const apiUrl = "/api/predictions";

  useEffect(() => {
    async function fetchData() {
      try {
        setShowLoading(true);
        const result = await axios.get(apiUrl);
        setPredictionData(result.data);
        setShowLoading(false);
      } catch (error) {
        console.log('error in fetchData:', error);
        setShowLoading(false);
      }
    }
    fetchData();
  }, []);

  /**
   * 
   * @param {*} houseType 
   * @returns House Type as String
   */
  function convertHouseType(houseType) {
    switch (houseType) {
      case 0:
        return "Condo Apt";
      case 1:
        return "Semi-Detached";
      case 2:
          return "Detached";
      case 3:
        return "Condo Townhouse";
      case 4:
        return "Duplex";
      case 5:
        return "Att/Row/Twnhouse";
      case 6:
        return "Co-Ownership Apt";
      case 7:
        return "Link";
      case 8:
        return "Comm Element Condo";
      default:
        return "Unknown";
    }
  }
  
  // Filter prediction data based on criteria
  const filteredPredictions = predictionData.filter(prediction => {
    const price = parseFloat(prediction.prediction);
    const bedrooms = parseFloat(prediction.bedrooms);
    const bathrooms = parseFloat(prediction.bathrooms);
    const sqft = parseFloat(prediction.sqft);
    const parking = parseFloat(prediction.parking);

    return (
      (price >= parseFloat(minPrice) || !minPrice) &&
      (price <= parseFloat(maxPrice) || !maxPrice) &&
      (bedrooms >= parseFloat(minBedrooms) || !minBedrooms) &&
      (bedrooms <= parseFloat(maxBedrooms) || !maxBedrooms) &&
      (bathrooms >= parseFloat(minBathrooms) || !minBathrooms) &&
      (bathrooms <= parseFloat(maxBathrooms) || !maxBathrooms) &&
      (sqft >= parseFloat(minSqft) || !minSqft) &&
      (sqft <= parseFloat(maxSqft) || !maxSqft) &&
      (parking >= parseFloat(minParking) || !minParking) &&
      (parking <= parseFloat(maxParking) || !maxParking)
    );
  });

  return (
    <div className="container mt-3">
      {showLoading && (
        <Spinner className='mt-3' animation="border" role="status">
          <span className='mt-3'></span>
        </Spinner>
      )}
    <div className="container mb-3">
      <h5>Filter Predictions</h5>
      <Row>
      <Col xs={12} md={6}>
        <div className="m-3">
          <Form.Control
            className='mb-1'
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
          <Form.Control
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="m-3">
          <Form.Control
            className='mb-1'
            type="number"
            placeholder="Min Bedrooms"
            value={minBedrooms}
            onChange={e => setMinBedrooms(e.target.value)}
          />
          <Form.Control
            type="number"
            placeholder="Max Bedrooms"
            value={maxBedrooms}
            onChange={e => setMaxBedrooms(e.target.value)}
          />
        </div>
        <div className="m-3">
          <Form.Control
            className='mb-1'
            type="number"
            placeholder="Min Bathrooms"
            value={minBathrooms}
            onChange={e => setMinBathrooms(e.target.value)}
          />
          <Form.Control
            type="number"
            placeholder="Max Bathrooms"
            value={maxBathrooms}
            onChange={e => setMaxBathrooms(e.target.value)}
          />
        </div>
      </Col>
      <Col xs={12} md={6}>
        <div className="m-3">
          <Form.Control
            className='mb-1'
            type="number"
            placeholder="Min Sqft"
            value={minSqft}
            onChange={e => setMinSqft(e.target.value)}
          />
          <Form.Control
            type="number"
            placeholder="Max Sqft"
            value={maxSqft}
            onChange={e => setMaxSqft(e.target.value)}
          />
        </div>
        <div className="m-3">
          <Form.Control
            className='mb-1'
            type="text"
            placeholder="Min Parking Spots"
            value={minParking}
            onChange={e => setMinParking(e.target.value)}
          />
          <Form.Control
            type="text"
            placeholder="Max Parking Spots"
            value={maxParking}
            onChange={e => setMaxParking(e.target.value)}
          />
        </div>
      </Col>
    </Row>
    </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Prediction</th>
            <th>Bedrooms</th>
            <th>Bathrooms</th>
            <th>Sqft</th>
            <th>Parking</th>
            <th>House Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredPredictions.map((prediction, index) => (
            <tr key={prediction._id}>
              <td>{index + 1}</td>
              <td>${parseFloat(prediction.prediction).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td>{prediction.bedrooms}</td>
              <td>{prediction.bathrooms}</td>
              <td>{prediction.sqft}</td>
              <td>{prediction.parking}</td>
              <td>{convertHouseType(prediction.houseType)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default PredictionList;
