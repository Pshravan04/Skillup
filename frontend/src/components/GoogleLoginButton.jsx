import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const GoogleLoginButton = ({ text = "Sign in with Google" }) => {
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse) => {
        try {
            const { credential } = credentialResponse;

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                `${process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000'}/api/auth/google`,
                { idToken: credential },
                config
            );

            // Save to local storage
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            navigate('/dashboard');

        } catch (error) {
            console.error('Google Login Error:', error);
            // Could add a toast notification here
        }
    };

    const handleError = () => {
        console.log('Google Login Failed');
    };

    return (
        <div className="w-full flex justify-center">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_black"
                text={text === "Sign up with Google" ? "signup_with" : "signin_with"}
                shape="pill"
                width="100%" // Trying to make it full width, usually px value works best
            />
        </div>
    );
};

export default GoogleLoginButton;
