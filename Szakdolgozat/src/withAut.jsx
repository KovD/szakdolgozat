import React from 'react';

const withAuth = (WrappedComponent) => {
    return () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return <h1>You are not authorized to view this page</h1>;
        }

        return <WrappedComponent/>;
    };
};

export default withAuth;