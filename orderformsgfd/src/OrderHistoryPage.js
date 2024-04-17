//OrderHistoryPage.js
import React from 'react';
import underConstruc from './underConstruction.jpg';
import mockData from './mock-data.json';
const OrderHistoryPage = ({ setCurrentPage }) => {

  
  return (
    <div id="orderHistoryContainer">
      <p id="orderHistoryText">Order History</p>
      <div id="pendingOrderContainer">
        <p id="pendingOrdersText">Pending Orders</p>
        <div>
          <table id="orderHistoryTable">
            <thead>
              <th className="headHistoryText">Date</th>
              <th className="headHistoryText">Status</th>
              <th className="deleteHeadText">Clear Order</th>
            </thead>
            <tr>
              
              <div className="divider-shadow"></div>

            </tr>
            <tbody>
              <p>hello</p>
            </tbody>
          </table>
        </div>
      </div>     
     </div>

  );
};

export default OrderHistoryPage;
