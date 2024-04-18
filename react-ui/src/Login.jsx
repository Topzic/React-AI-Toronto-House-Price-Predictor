/* eslint-disable no-unused-vars */
/* Login.js */
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import Home from './Home'

// mutation for user login
const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      email
      role
      token
    }
  }
`;

// Login function component
function Login() {
    
    const signIn = useSignIn();
    const isAuthenticated = useIsAuthenticated()
    
    let navigate = useNavigate()

    // loginUser is a function that can be called to execute
    // the LOGIN_USER mutation, and { data, loading, error } 
    // is an object that contains information about the state of the mutation.
    const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

    //store input field data, user name and password
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [token, setToken] = useState('');
   
    const handleLogin = async (event) => {
        event.preventDefault();

        try {
          const { data } = await loginUser({
            variables: { email, password, token }
          });

          setEmail('');
          setPassword('');
          console.log('Authenticated: ', data.loginUser);

          if (data.loginUser) {
            signIn({
              auth: {
                token: data.loginUser.token,
                expiresIn: 1,
                tokenType: "Bearer",
                authState: { email: data.loginUser.email },
              }
            })
            navigate('/home');
          }
        } catch (error) {
          console.error('Login error:', error);
        }
    };

    // Render the login form or the welcome message based on the value of 'screen'
    return (
        <div className="entryform">
            { isAuthenticated ? (
                <Home screen={screen} /> ) : (

                <Form onSubmit={handleLogin}>
                    
                    <Form.Group>
                        <Form.Label> Email:</Form.Label>
                        <Form.Control id="email" type="email"  onChange={(event) => setEmail(event.target.value)} 
                            placeholder="Email:" />
                    </Form.Group>                    
                    
                    <Form.Group>
                        <Form.Label> Password:</Form.Label>
                        <Form.Control id="password" type="password"  onChange={(event) => setPassword(event.target.value)}
                            placeholder="Password:" />
                    </Form.Group>  
            
                    <Button className='mt-3' size = "lg" variant="primary" type="submit" >
                        Login
                    </Button>
                  
                </Form>
            )}            
            
        </div>
    );
}
//
export default Login;