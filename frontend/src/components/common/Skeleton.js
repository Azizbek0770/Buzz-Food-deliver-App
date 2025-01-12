import React from 'react';

export const RestaurantSkeleton = () => (
    <div className="skeleton-wrapper">
        <div className="skeleton-restaurant">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
            </div>
        </div>
    </div>
);

export const MenuItemSkeleton = () => (
    <div className="skeleton-wrapper">
        <div className="skeleton-menu-item">
            <div className="skeleton-image"></div>
            <div className="skeleton-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-price"></div>
            </div>
        </div>
    </div>
); 