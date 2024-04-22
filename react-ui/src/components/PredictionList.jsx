/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Form, Col, Row } from "react-bootstrap";
import GoogleMapReact from "google-map-react";
import CustomMarker from "./CustomMarker";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import { CSVLink } from "react-csv";

// Default map coordinates and zoom level
const defaultProps = {
  center: {
    lat: 43.65115280819503,
    lng: -79.38317571139164,
  },
  zoom: 12,
};

function PredictionList() {
  const [predictionData, setPredictionData] = useState([]);
  const [showLoading, setShowLoading] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [maxBedrooms, setMaxBedrooms] = useState("");
  const [minBathrooms, setMinBathrooms] = useState("");
  const [maxBathrooms, setMaxBathrooms] = useState("");
  const [minSqft, setMinSqft] = useState("");
  const [maxSqft, setMaxSqft] = useState("");
  const [minParking, setMinParking] = useState("");
  const [maxParking, setMaxParking] = useState("");
  const isAuthenticated = useIsAuthenticated();

  const headers = [
    { label: "Email", key: "email" },
    { label: "Prediction", key: "prediction" },
    { label: "Bedrooms", key: "bedrooms" },
    { label: "Bathrooms", key: "bathrooms" },
    { label: "Sqft", key: "sqft" },
    { label: "Parking", key: "parking" },
    { label: "Email", key: "houseType" },
    { label: "Latitude", key: "lat" },
    { label: "Longitude", key: "long" },
  ];

  const apiUrl = "http://localhost:5000/predictions"; // URL to retrieve all house predictions from database

  useEffect(() => {
    async function fetchData() {
      try {
        setShowLoading(true);
        const result = await axios.get(apiUrl);
        setPredictionData(result.data);
        setShowLoading(false);
      } catch (error) {
        console.log("error in fetchData:", error);
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

  function setIcon(int) {
    switch (int) {
      case 0:
        return "/apartment.png"; // Condo Apt
      case 1:
        return "/semi-detached.png"; // Semi-Detached
      case 2:
        return "/detached.png"; // Detached
      case 3:
        return "/townhouse.png"; // Condo Townhouse
      case 4:
        return "/duplex.png"; // Duplex
      case 5:
        return "/townhouse.png"; // Att/Row/Twnhouse
      case 6:
        return "/apartment.png"; // Co-Ownership Apt
      case 7:
        return "/detached.png"; // Detached // Link
      case 8:
        return "/apartment.png"; // Condo Apt
      default:
        return "/detached.png"; // Detached
    }
  }

  // Filter prediction data based on criteria
  const filteredPredictions = predictionData.filter((prediction) => {
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
        <Spinner className="mt-3" animation="border" role="status">
          <span className="mt-3"></span>
        </Spinner>
      )}
      <div className="m-3" style={{ height: "50vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyAQ8LXqUZwItlgitqZ-C7DHDDcy_2GxRoU" }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
        >
          {filteredPredictions.map((prediction, index) => (
            <CustomMarker
              key={index}
              lat={prediction.lat}
              lng={prediction.long}
              prediction={prediction}
              icon={setIcon(prediction.houseType)}
            />
          ))}
        </GoogleMapReact>
      </div>
      {isAuthenticated ? (
        <>
          <h3>Filter Predictions</h3>
          <div className="container-fluid">
            {/** Price Filters */}
            <div className="row">
              <div className="col-sm mb-2">
                <b>Min Price</b>
                <Form.Control
                  className="mb-1"
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </div>
              <div className="col-sm mb-2">
                <b>Max Price</b>
                <Form.Control
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
            </div>

            {/** Bedroom Filters */}
            <div className="row">
              <div className="col-sm mb-2">
                <b>Min Bedroom</b>
                <Form.Control
                  className="mb-1"
                  type="number"
                  placeholder="Min Bedrooms"
                  value={minBedrooms}
                  onChange={(e) => setMinBedrooms(e.target.value)}
                />
              </div>
              <div className="col-sm mb-2">
                <b>Max Bedroom</b>
                <Form.Control
                  type="number"
                  placeholder="Max Bedrooms"
                  value={maxBedrooms}
                  onChange={(e) => setMaxBedrooms(e.target.value)}
                />
              </div>
            </div>

            {/** Bathroom Filters */}
            <div className="row">
              <div className="col-sm mb-2">
                <b>Min Bathroom</b>
                <Form.Control
                  type="number"
                  placeholder="Min Bathrooms"
                  value={minBathrooms}
                  onChange={(e) => setMinBathrooms(e.target.value)}
                />
              </div>
              <div className="col-sm mb-2">
                <b>Max Bathroom</b>
                <Form.Control
                  type="number"
                  placeholder="Max Bathrooms"
                  value={maxBathrooms}
                  onChange={(e) => setMaxBathrooms(e.target.value)}
                />
              </div>
            </div>

            {/** Sqft Filters */}
            <div className="row">
              <div className="col-sm mb-2">
                <b>Min Sqft</b>
                <Form.Control
                  type="number"
                  placeholder="Min Sqft"
                  value={minSqft}
                  onChange={(e) => setMinSqft(e.target.value)}
                />
              </div>
              <div className="col-sm mb-2">
                <b>Max Sqft</b>
                <Form.Control
                  type="number"
                  placeholder="Max Sqft"
                  value={maxSqft}
                  onChange={(e) => setMaxSqft(e.target.value)}
                />
              </div>
            </div>

            {/** Parking Filters */}
            <div className="row">
              <div className="col-sm mb-2">
                <b>Min Parking Spots</b>
                <Form.Control
                  type="text"
                  placeholder="Min Parking Spots"
                  value={minParking}
                  onChange={(e) => setMinParking(e.target.value)}
                />
              </div>
              <div className="col-sm mb-2">
                <b>Max Parking Spots</b>
                <Form.Control
                  type="text"
                  placeholder="Max Parking Spots"
                  value={maxParking}
                  onChange={(e) => setMaxParking(e.target.value)}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <p>
            You need to <a href="/login">login</a> to use the filter feature.
          </p>
        </>
      )}
      <div className="container m-3"></div>
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
            <th>Latitude</th>
            <th>Longitude</th>
            <th>View Location</th>
          </tr>
        </thead>
        <tbody>
          {filteredPredictions.map((prediction, index) => (
            <tr key={prediction._id}>
              <td>{index + 1}</td>
              <td>
                $
                {parseFloat(prediction.prediction).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
              <td>{prediction.bedrooms}</td>
              <td>{prediction.bathrooms}</td>
              <td>{prediction.sqft}</td>
              <td>{prediction.parking}</td>
              <td>{convertHouseType(prediction.houseType)}</td>
              <td>{parseFloat(prediction.lat).toFixed(6)}</td>
              <td>{parseFloat(prediction.long).toFixed(6)}</td>
              <td>
                <a
                  target="_blank"
                  href={`http://maps.google.com/maps?z=12&t=m&q=${prediction.lat}+${prediction.long}`}
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isAuthenticated ? (
        <Button className="mb-3">
          <CSVLink
            data={filteredPredictions}
            headers={headers}
            filename="MyPredictions"
            style={{ color: "white" }}
          >
            Export Table
          </CSVLink>
        </Button>
      ) : (
        <>
          <p>
            You need to <a href="/login">login</a> to export the table.
          </p>
        </>
      )}
    </div>
  );
}

export default PredictionList;
