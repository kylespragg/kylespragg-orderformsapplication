// App.js
// Author: Kyle Spragg
// Date Created: 12/18/23
// Last Updated: 1/18/24
// Issue with running? Write in terminal: export NODE_OPTIONS=--openssl-legacy-provider
import React, { useState } from 'react';
import logo from './logo.png';
import SendOrderPage from './SendOrderPage';
import CheckOrderPage from './CheckOrderPage';
import OrderHistoryPage from './OrderHistoryPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('sendOrder');

  const handleButtonClick = (buttonName) => {
    console.log(`Page clicked: ${buttonName}`);
    setCurrentPage(buttonName);
  };

  return (
    <div>
      <div className="custom-main-border">
        <div className="mainHeader">Gentle Family Dentistry<br/>Order Forms</div>
        <div className="containermainlogo">
          <img src={logo} alt="Logo" className="mainlogo" />
        </div>
          <div className="tabs">
            {/* Navigation buttons or links */}
            <button onClick={() => handleButtonClick('sendOrder')}>Send Order</button>
            <button onClick={() => handleButtonClick('checkOrder')}>Check Order</button>
            <button onClick={() => handleButtonClick('orderHistory')}>Order History</button>
          </div>
      </div>
        {/* Render the current page */}
        {currentPage === 'sendOrder' && <SendOrderPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'checkOrder' && <CheckOrderPage setCurrentPage={setCurrentPage} />}
        {currentPage === 'orderHistory' && <OrderHistoryPage setCurrentPage={setCurrentPage} />}
      
    </div>
  );
};

export default App;

