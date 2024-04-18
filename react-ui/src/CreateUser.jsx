/* eslint-disable no-unused-vars */
import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//
import { useNavigate } from 'react-router-dom';

import "./entryform.css"
//
//
const CREATE_USER = gql`
    mutation CreateUser( $username: String!,  $email: String!, $password: String! ) {
        createUser( username: $username, email: $email, password: $password  ) {
            username
            email
            password

        }
    }
`;
//function component to add a student
const CreateUser = () => {
    //
    let navigate = useNavigate()
    //
    let username, email, password ;
    const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

    if (loading) return 'Submitting...';
    if (error) return `Submission error! ${error.message}`;

    return (
        <div className = 'entryform'>
            <form
                onSubmit={ e => {    
                    e.preventDefault();
                    createUser( { variables: { username: username.value, email: email.value, 
                    password: password.value } 
                    });
                    //
                    username.value = '';
                    email.value='';
                    password.value='';
                    //
                    navigate('/home')                    
                    } 
                }
            >

                    <Form.Group>
                        <Form.Label> User Name:</Form.Label>
                        <Form.Control type="text"  name="username" ref={node => {username = node; }} 
                            placeholder="User Name:" />
                    </Form.Group>                   
              
                    <Form.Group>
                        <Form.Label> Email:</Form.Label>
                        <Form.Control type="text"  name="email" ref={node => {email = node; }} 
                            placeholder="Email:" />
                    </Form.Group>                     
                

                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control type="password"  name="password" ref={node => {password = node; }} 
                            placeholder="Password:" />
                    </Form.Group>                      

                    <Button variant="primary" type="submit"> Create User </Button>

            </form>
        </div>
    );
}
//
export default CreateUser
