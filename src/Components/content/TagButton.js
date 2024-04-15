import React from 'react';

export default function TagButton({ handleClick, value, children }) {
    return (
        <button type="button" onClick={() => handleClick(value)}>
            {children}
        </button>
    );
}
