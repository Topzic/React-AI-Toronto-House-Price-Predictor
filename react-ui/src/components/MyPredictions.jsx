/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";
import { gql, useMutation } from "@apollo/client";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { CSVLink } from "react-csv";

const GET_USER_PREDICTIONS = gql`
  mutation PredictionsByEmail($email: String!) {
    predictionsByEmail(email: $email) {
      _id
      email
      prediction
      bedrooms
      bathrooms
      sqft
      parking
      houseType
      lat
      long
    }
  }
`;

const DELETE_PREDICTION = gql`
  mutation DeletePrediction($id: String!) {
    deletePrediction(id: $id) {
      _id
    }
  }
`;

const MyPredictions = () => {
  const authUser = useAuthUser();
  const email = authUser.email;
  const [deleteUserPrediction] = useMutation(DELETE_PREDICTION);
  const [getUserPredictions, { loading, error, data }] =
    useMutation(GET_USER_PREDICTIONS);
  const [userPredictions, setUserPredictions] = useState(null);

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

  useEffect(() => {
    getUserPredictions({ variables: { email } });
  }, [getUserPredictions, email]);

  useEffect(() => {
    if (data && data.predictionsByEmail) {
      setUserPredictions(data.predictionsByEmail);
    }
  }, [data]);

  // Function to remove prediction with a specific id
  const handleDeletePrediction = async (id) => {
    try {
      console.log("id: " + id);
      await deleteUserPrediction({ variables: { id } });
      // Filter out the deleted prediction from the userPredictions state
      setUserPredictions((prevPredictions) =>
        prevPredictions.filter((prediction) => prediction._id !== id)
      );
      console.log("Prediction deleted successfully.");
    } catch (error) {
      console.error("Error deleting prediction:", error);
    }
  };

  // const { onDownload } = useDownloadExcel({
  //       currentTableRef: tableRef.current,
  //       filename: 'Predictions',
  //       sheet: 'Toronto House Price Predictions'
  //   })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mt-3">
      {/* <p>Welcome to your predictions!</p> */}
      {userPredictions ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Prediction</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Sqft</th>
                <th>Parking</th>
                <th>House Type</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {userPredictions.map((prediction) => (
                <tr key={prediction.email + prediction.prediction}>
                  <td>
                    $
                    {parseFloat(prediction.prediction).toLocaleString(
                      undefined,
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </td>
                  <td>{prediction.bedrooms}</td>
                  <td>{prediction.bathrooms}</td>
                  <td>{prediction.sqft}</td>
                  <td>{prediction.parking}</td>
                  <td>{convertHouseType(prediction.houseType)}</td>
                  <td>{parseFloat(prediction.lat).toFixed(6)}</td>
                  <td>{parseFloat(prediction.long).toFixed(6)}</td>
                  <td>
                    <Button
                      className="btn-danger"
                      onClick={() => handleDeletePrediction(prediction._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button>
            <CSVLink
              data={userPredictions}
              headers={headers}
              filename="MyPredictions"
              style={{ color: "white" }}
            >
              Export Table
            </CSVLink>
          </Button>
        </>
      ) : (
        <p>No predictions found.</p>
      )}
    </div>
  );
};

export default MyPredictions;
