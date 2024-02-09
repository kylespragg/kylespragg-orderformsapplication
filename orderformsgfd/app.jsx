// App.jsx

import React from 'react';

const App = () => {
  const handleButtonClick = () => {
    // Add the logic you want to execute when the button is clicked
    console.log('Button clicked!');
  };

  return (
    <div>
      <h1>Your App</h1>

      <div className="containermainlogo">
        <img src="logo.png" alt="Logo" className="mainlogo" />
        <div className="custom-main-border">
          <h1>Gentle Family Dentistry<br />Order Forms</h1>
        </div>

        <button className="button-item" onClick={handleButtonClick}>
          Click me
        </button>

        <div className="items-container">
          <div className="custom-items-border">
            <h2>General</h2>
          </div>
          <div className="custom-items-border">
            <h2>Hygiene</h2>
          </div>
        </div>

        <div className="items-container">
          <div className="custom-items-border">
            <h2>Other</h2>
          </div>
          <div className="custom-items-border">
            <h2>Costco</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
