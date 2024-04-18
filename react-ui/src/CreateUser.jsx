/* eslint-disable no-unused-vars */
import {React, useState} from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//
import { useNavigate } from 'react-router-dom';

import "./entryform.css"
//
//
// const CREATE_USER = gql`
//     mutation CreateUser( $username: String!,  $email: String!, $password: String! ) {
//         createUser( username: $username, email: $email, password: $password  ) {
//             username
//             email
//             password

//         }
//     }
// `;
const CREATE_USER = gql`
    mutation CreateUser( $email: String!, $password: String! ) {
        createUser( email: $email, password: $password  ) {
            email
            password

        }
    }
`;
//function component to add a student
const CreateUser = () => {
    //
    let navigate = useNavigate()
    let [message, setMessage] = useState('');
    //
    let email, password ;
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <div className = 'entryform' style={{ marginTop: "15%" }}>
            <form
                onSubmit={async e => {
                    e.preventDefault();
                    try {
                        const response = await createUser({
                            variables: {
                                email: email.value,
                                password: password.value
                            }
                        });
                        console.log(response.data.createUser)
                        if (response.data.createUser) {
                            navigate('/home');
                        } else {
                            // Error: Email is null or not found in the response
                            setMessage("That email is already registered to an account.");
                        }
                    } catch (error) {
                        console.error("Error occurred:", error);
                    }
                }}
            >

                    <p>{message}</p>
                    <Form.Group>
                        <Form.Label> Email:</Form.Label>
                        <Form.Control type="text"  name="email" ref={node => {email = node; }} 
                            placeholder="example@hotmail.com" />
                    </Form.Group>                     
                

                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control type="password"  name="password" ref={node => {password = node; }} 
                            placeholder="Password:" />
                    </Form.Group>                      

                    <Button variant="primary" type="submit" className='mt-3'> Create User </Button>

            </form>
        </div>
    );
}
//
export default CreateUser
