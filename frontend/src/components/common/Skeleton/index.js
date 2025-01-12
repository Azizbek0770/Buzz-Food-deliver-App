import React from 'react';
import './Skeleton.css';

export const RestaurantSkeleton = () => (
    <div className="skeleton-card">
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-meta">
                <div className="skeleton-rating"></div>
                <div className="skeleton-address"></div>
            </div>
        </div>
    </div>
); 