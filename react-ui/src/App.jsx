/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [formData, setFormData] = useState({
    sepalLength: '',
    sepalWidth: '',
    petalLength: '',
    petalWidth: '',
    epochs: '',
    learningRate: ''
  });
  const [predictionData, setPredictionData] = useState({});
  const [showLoading, setShowLoading] = useState(false);
  const apiUrl = "/api/run";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowLoading(true);
    try {
      const result = await axios.get(apiUrl, {
        params: {
          sepalLength: formData.sepalLength,
          sepalWidth: formData.sepalWidth,
          petalLength: formData.petalLength,
          petalWidth: formData.petalWidth,
          epochs: formData.epochs,
          learningRate: formData.learningRate
        }
      });
      setPredictionData(result.data);
    } catch (error) {
      console.log('error in handleSubmit:', error);
    }
    setShowLoading(false);
  };

  return (
    <div className="container">
    <h2>Iris Species Predictor</h2>
    <hr></hr>

    {showLoading && (
            <Spinner className='mt-3' animation="border" role="status">
              <span className='mt-3'></span>
            </Spinner>
          )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Sepal Length:</label>
              <input type="text" className="form-control" name="sepalLength" value={formData.sepalLength} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Sepal Width:</label>
              <input type="text" className="form-control" name="sepalWidth" value={formData.sepalWidth} onChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Petal Length:</label>
              <input type="text" className="form-control" name="petalLength" value={formData.petalLength} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Petal Width:</label>
              <input type="text" className="form-control" name="petalWidth" value={formData.petalWidth} onChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Epochs:</label>
              <input type="text" className="form-control" name="epochs" value={formData.epochs} onChange={handleChange} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group">
              <label>Learning Rate:</label>
              <input type="text" className="form-control" name="learningRate" value={formData.learningRate} onChange={handleChange} />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">Submit</button>
      </form>

        <div className="mt-3">
          {/* <h2>Prediction Results</h2> */}
          <table className="table">
            <thead>
              <tr>
                <th>Raw Prediction Values</th>
                <th>Predicted Species</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{predictionData.rawValues && predictionData.rawValues.map((value, idx) => <p key={idx}>{value}</p>)}</td> {/* Display the raw prediction values */}
                <td>{predictionData.species}</td> {/* Display the predicted species */}
              </tr>
            </tbody>
          </table>

      </div>
      </div>
  );
}

export default App;