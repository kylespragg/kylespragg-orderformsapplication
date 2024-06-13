//OrderHistoryPage.js
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import axios from 'axios';
const serverUrl = 'http://localhost:3001';

const OrderHistoryPage = ({ setCurrentPage }) => {
  const [itemData, setItemData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [receivedData, setReceivedData] = useState([]);
  const [warningMessage, setWarningMessage] = useState(false); //warning message for clearing orders
  const [deleteDate, setDeleteDate] = useState('');
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect (() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${serverUrl}/orderforms/`);
        setItemData(response.data);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData();
  }, []);
  useEffect (() => {
      const groupByDate = {};
      itemData.forEach((item) => {  
        const date = moment(item.postDate).format('MMM/DD/YYYY') //have to format the date because we do not want MM:ss
        if (groupByDate[date]) {
          groupByDate[date].push(item); //groups items in a key value pair for all the dates with the same date
        } else {
          groupByDate[date] = [item]
        }
      });
      setGroupedData(groupByDate);

      const receivedDataGroup = [];
      const pendingDataGroup = [];

      for ( const [date, items] of Object.entries(groupByDate)) {
        
        let allReceived = true;
        let allSent = true;
        let inProgress = false;
        let count = 0
        let receivedAll = items.length
        for (const item of items) {
          if (item.status === 'received') {
            count += 1;
          }
          if (item.status === 'in-progress') {
            inProgress = true;
            allSent = false;
            allReceived = false;
            break; // Break out of the inner loop if any item is 'in progress'
          }
          if (count === receivedAll) {
            allSent = false;
            allReceived = true;
          } else {
            if (count > 0) { // checks if there is one item that is marked "received" while the rest are sent --> order is in progress
              inProgress = true;
              allSent = false;
            }
            allReceived = false; // sets allReceived to false
          }
        }
        if (allReceived === true) {
          if (!receivedDataGroup.some(entry => entry.date === date)) {
            console.log(date);
            receivedDataGroup.push(date);
          }
        } else if (allSent === true) {
            if (!pendingDataGroup.some(entry => entry.date === date )) {
              pendingDataGroup.push({ date, status: 'sent' });
            }
        } else if (inProgress === true) {
            if (!pendingDataGroup.some(entry => entry.date === date )) {
              pendingDataGroup.push({ date, status: 'in progress' });
            }
        }   
      }
      setPendingData(pendingDataGroup);
      setReceivedData(receivedDataGroup);
    
      
    }, [itemData]);

    const clearOrderWarning = (date) => {
      setWarningMessage(true);
      setDeleteDate(date);
    }
    const handleCloseModal = () => {
      setWarningMessage(false);
    };
  
    const handleConfirmClear = async () => {

      await Promise.all(groupedData[deleteDate].map(async (entry) => {
        console.log(entry);
        try {
          const response = await axios.delete(`${serverUrl}/orderforms/${entry.id}`);
          console.log('Console responded with:',JSON.stringify(response.data));
          // Handle deletion success or update local state accordingly
        } catch (error) {
          console.error('Error deleting entry:', error);
          // Handle deletion error
        }
      }));
      try {
        const response = await axios.get(`${serverUrl}/orderforms/`);
        setItemData(response.data); // Update itemData with the refreshed data
      } catch (err) {
        console.log(err);
      }
      setWarningMessage(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);

    };

    // add functionality for the clear button --> add pop up window with warning message "Are you sure?" Yes/No --> axios.delete()
  return (
    <div id="orderHistoryContainer">
      <p id="orderHistoryText">Order History</p>
      <p className="ordersText">Pending Orders</p>
      <table className="orderHistoryTable">
        <thead className ="divider-shadow">
          <tr>
            <th className="headHistoryText">Date</th>
            <th className="headHistoryText">Status</th>
            <th className="clearOrderHeadText">Clear Order</th>
          </tr>
        </thead>
        <tbody>
          {pendingData.map(( { date, status } ) => (
            <tr key={date}>
              <td className="columnDateText">{date}</td>
              <td>
                <div className="itemStatusText">{status}</div>
              </td>
              <td>
                <button className="clearOrderText" onClick={() => clearOrderWarning(date)}>Clear</button>
              </td>
            </tr>              
          ))}
        </tbody>
      </table>

      <p className="ordersText">Completed Orders</p> {/* fix styling on this table --> offset */}
      <table className="orderHistoryTable">
        <thead className="divider-shadow">
          <tr>
            <th className="headHistoryText">Date</th>
            <th className="headHistoryText">Status</th>
            <th className="clearOrderHeadText">Clear Order</th>
          </tr>
        </thead>
        <tbody>
          {receivedData.map((date) => (
            <tr key={date}>
              <td className="columnDateText">{date}</td>
              <td>
                <div className="itemStatusText">received</div>
              </td>
              <td>
                <button className="clearOrderText" onClick={() => clearOrderWarning(date)}>Clear</button>
              </td>
            </tr>              
          ))}
        </tbody>
      </table>
      {warningMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="deleteMessageText" >Are you sure you want to clear the order?</h2>
            <div className="modal-buttons">
              <button className="modal-button" onClick={handleConfirmClear}>Yes</button>
              <button className="modal-button" onClick={handleCloseModal}>No</button>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="deleteMessageText">Order Successfuly Deleted!</h2>
            </div>
          </div>
      )}
  </div>
  );  
};

export default OrderHistoryPage;

/* 
Complete clear button, ask dad if there is any other functionality needed/wanted
check css styles, fix css media quries, check all warnings
figure out best course of action to live deploy
*/