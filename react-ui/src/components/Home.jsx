/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import region from "/region.png";

function Home() {
  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <div className="jumbotron">
            <h1 className="display-4">
              Welcome to the House Price Prediction Hub!
            </h1>
            <p className="lead">
              We help you predict house prices based on various factors such as
              bedrooms, bathrooms, square footage, parking spots, longitude,
              latitude, and house type.
            </p>
            <Row className="mt-4">
              <Col>
                <h2>Why Choose Us?</h2>
                <p>
                  We provide accurate predictions using advanced machine
                  learning algorithms.
                </p>
                <p>
                  Our user-friendly interface makes it easy for you to explore
                  predictions and make new predictions.
                </p>
              </Col>
            </Row>
            <Link to="/list">
              <Button variant="primary" className="m-2">
                View Predictions
              </Button>
            </Link>
            <Link to="/prediction">
              <Button variant="info">Make a Prediction</Button>
            </Link>
            <hr className="mb-4" />
            <img src={region} style={{ width: "75%" }}></img>
            <p>Our data was collected in this area of the toronto region.</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home; // Export Home react component
