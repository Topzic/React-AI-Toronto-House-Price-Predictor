/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const CustomMarker = ({ prediction, icon, popupText }) => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

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

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)",
          cursor: "pointer",
        }}
        onClick={togglePopup}
      >
        <img
          src={icon}
          alt="Marker Icon"
          style={{ width: "30px", height: "30px", zIndex: 1 }}
        />
      </div>
      {showPopup && (
        <div
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: "-40px",
            backgroundColor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            zIndex: 2,
          }}
          onClick={togglePopup}
        >
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ textAlign: "center", fontSize: 14 }} colSpan="2">
                  <b>Property Details</b>
                </td>
              </tr>
              <tr>
                <td>Price:</td>
                <td>
                  $
                  {parseFloat(prediction.prediction).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
              <tr>
                <td>Bdrm:</td>
                <td>{prediction.bedrooms}</td>
              </tr>
              <tr>
                <td>BA:</td>
                <td>{prediction.bathrooms}</td>
              </tr>
              <tr>
                <td>Sqft:</td>
                <td>{prediction.sqft}</td>
              </tr>
              <tr>
                <td>Parking:</td>
                <td>{prediction.parking}</td>
              </tr>
              <tr>
                <td>Type:</td>
                <td>{convertHouseType(prediction.houseType)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomMarker;
