import React from 'react';

export default function Loading({ isShow }) {
    const loadingStyle = {
        display: isShow ? 'block' : 'none'
    };

    return (
        <div className="loading" style={loadingStyle}></div>
    );
}
