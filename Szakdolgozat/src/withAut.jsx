import React from 'react';

const withAuth = (WrappedComponent, ) => {
    return () => {
        const token = localStorage.getItem('token');

        if (!token) {
            return <h1>Please login to view this page</h1>;
        }

        return <WrappedComponent/>;
    };
};

export default withAuth;