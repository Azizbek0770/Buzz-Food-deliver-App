import React, { useState } from 'react';

// Loading state uchun hook
export const useLoading = (initialState = false) => {
    const [loading, setLoading] = useState(initialState);
    const [error, setError] = useState(null);
    
    const withLoading = async (callback) => {
        setLoading(true);
        setError(null);
        try {
            await callback();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return { loading, error, withLoading };
}; 