import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import './Statistics.css';

const Statistics = ({ data }) => {
  const {
    totalOrders,
    totalRevenue,
    averageOrderValue,
    popularDishes,
    ordersByHour,
    customerSatisfaction
  } = data;

  return (
    <div className="dashboard-statistics">
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Jami buyurtmalar</h4>
          <div className="stat-value">{totalOrders}</div>
        </div>
        
        <div className="stat-card">
          <h4>Jami tushum</h4>
          <div className="stat-value">
            {totalRevenue.toLocaleString()} so'm
          </div>
        </div>
        
        <div className="stat-card">
          <h4>O'rtacha buyurtma</h4>
          <div className="stat-value">
            {averageOrderValue.toLocaleString()} so'm
          </div>
        </div>
        
        <div className="stat-card">
          <h4>Mijozlar bahosi</h4>
          <div className="stat-value">
            {customerSatisfaction.toFixed(1)} / 5
          </div>
        </div>
      </div>

      <div className="chart-section">
        <h4>Soatlar bo'yicha buyurtmalar</h4>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ordersByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="orders"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="popular-dishes">
        <h4>Mashhur taomlar</h4>
        <div className="dishes-grid">
          {popularDishes.map(dish => (
            <div key={dish.id} className="dish-card">
              <img src={dish.image} alt={dish.name} />
              <div className="dish-info">
                <h5>{dish.name}</h5>
                <span>{dish.orderCount} marta buyurtma qilingan</span>
                <span>{dish.rating.toFixed(1)} / 5 baho</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

Statistics.propTypes = {
  data: PropTypes.shape({
    totalOrders: PropTypes.number.isRequired,
    totalRevenue: PropTypes.number.isRequired,
    averageOrderValue: PropTypes.number.isRequired,
    customerSatisfaction: PropTypes.number.isRequired,
    ordersByHour: PropTypes.arrayOf(
      PropTypes.shape({
        hour: PropTypes.string.isRequired,
        orders: PropTypes.number.isRequired
      })
    ).isRequired,
    popularDishes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        orderCount: PropTypes.number.isRequired,
        rating: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired
};

export default Statistics; 