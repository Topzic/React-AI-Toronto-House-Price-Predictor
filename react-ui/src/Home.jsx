/* eslint-disable no-unused-vars */
// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { Container, Row, Col, Button } from 'react-bootstrap'; // Import components from react-bootstrap

function Home() {

  return (
    <Container>
      <Row className="mt-5">
        <Col>
          <div className="jumbotron">
            <h1 className="display-4">Welcome to the House Price Prediction Hub!</h1>
            <p className="lead">
              We help you predict house prices based on various factors such as bedrooms, bathrooms, square footage, parking spots, and house type.
            </p>
            <hr className="my-4" />
            <p>
              Explore our features:
            </p>
            <p className="lead">
              <Link to="/list">
                <Button variant="primary" className="m-2">View Predictions</Button>
              </Link>
              <Link to="/prediction">
                <Button variant="info">Make a Prediction</Button>
              </Link>
            </p>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h2>Why Choose Us?</h2>
          <p>
            We provide accurate predictions using advanced machine learning algorithms.
          </p>
          <p>
            Our user-friendly interface makes it easy for you to explore predictions and make new predictions.
          </p>
        </Col>
      </Row>
    </Container>
    
  );
}

export default Home;
