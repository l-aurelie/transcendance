import React from 'react';
import Logo from '../components/Logo';
import Navigation from '../components/Navigation';

const Error404 = () => {
    return (
        <div>
            <Logo></Logo>
            <Navigation></Navigation>
            <h1>404 error: File not found</h1>
        </div>
    );
};

export default Error404;