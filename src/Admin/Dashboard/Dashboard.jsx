import React from 'react';

function Dashboard() {
    return (
        <div className="dashboard">
            <h1>Admin Panel Dashboard</h1>
            <div className="stats">
                <div className="stat-item">
                    <h2>Users</h2>
                    <p>100</p>
                </div>
                <div className="stat-item">
                    <h2>Orders</h2>
                    <p>50</p>
                </div>
                <div className="stat-item">
                    <h2>Revenue</h2>
                    <p>$5000</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;