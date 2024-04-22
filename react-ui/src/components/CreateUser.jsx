/* eslint-disable no-unused-vars */
import { React, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./entryform.css";

// Mutation to create new user
const CREATE_USER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      email
      password
    }
  }
`;

const CreateUser = () => {
  let navigate = useNavigate(); // Initalize navigation between pages
  let [message, setMessage] = useState(""); // Initalize message use state

  let email, password;
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER); // Assign mutation to createUser variable

  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;

  return (
    <div className="entryform" style={{ marginTop: "15%" }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            // Asynchronous call to create new user
            const response = await createUser({
              variables: {
                // Passes email and password variable to the backend
                email: email.value,
                password: password.value,
              },
            });
            // console.log(response.data.createUser); // Logs user object
            if (response.data.createUser) {
              navigate("/home"); // If successful navigates user to home page
            } else {
              setMessage("That email is already registered to an account."); // If unsuccessful sets message for user
            }
          } catch (error) {
            console.error("Error occurred:", error); // Catches error and logs to console
          }
        }}
      >
        <p>{message}</p>
        <Form.Group>
          <Form.Label> Email:</Form.Label>
          <Form.Control
            type="text"
            name="email"
            ref={(node) => {
              email = node;
            }}
            placeholder="example@hotmail.com"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label> Password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
            ref={(node) => {
              password = node;
            }}
            placeholder="Password:"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Create User
        </Button>
      </form>
    </div>
  );
};
//
export default CreateUser; // Export CreateUser react component
