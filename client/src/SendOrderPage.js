// SendOrderPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './sendorder.css';
const serverUrl = 'http://localhost:3001';


const SendOrderPage = ({ setCurrentPage }) => {

  const [generalItems, setGeneralItems] = useState([]);
  const [hygieneItems, setHygieneItems] = useState([]); // both use states help reset the new list each time an item is added
  const [newGeneralItem, setNewGeneralItem] = useState('');
  const [newHygieneItem, setNewHygieneItem] = useState('');
  const [newGeneralItemQuantity, setNewGeneralItemQuantity] = useState('');
  const [newHygieneItemQuantity, setNewHygieneItemQuantity] = useState('');
  const [showGeneralSuccessMessage, setGeneralSuccessMessage] = useState(false);
  const [showHygieneSuccessMessage, setHygieneSuccessMessage] = useState(false);



  const handleAddGeneralItem = () => {

    if (newGeneralItem.trim() !== '' && newGeneralItemQuantity > 0) { 
    
      console.log(`Added new general item: ${newGeneralItem} (Quantity: ${newGeneralItemQuantity})`);
      setGeneralItems((prevItems) => [...prevItems, {name: newGeneralItem, quantity: newGeneralItemQuantity, status: 'sent', type: 'general'} ]); // updates generalItems with new item
      setNewGeneralItem(''); // resets the state of setNewGeneralItem to an emtpy string 
      setNewGeneralItemQuantity('');
    }

  };

  const handleAddHygieneItem = () => {

    if (newHygieneItem.trim() !== '' && newHygieneItemQuantity > 0) {

      console.log(`Added hygiene item: ${newHygieneItem} (Quantity: ${newHygieneItemQuantity})`);
      setHygieneItems((prevItems) => [...prevItems, {name: newHygieneItem, quantity: newHygieneItemQuantity, status: 'sent', type: 'hygiene'} ]); //gives hygiene item object a .name and .quantity feature
      setNewHygieneItem('');
      setNewHygieneItemQuantity('');
    }
  };

  const handleRemoveItem = (index, itemType) => {

    if (itemType === 'general') {
  
      const removedItem = generalItems[index];
      console.log(`Removed general item: ${removedItem.name}`)
      const updatedItems = generalItems.filter((item, i) => i !== index);

      setGeneralItems(updatedItems);

    } else if (itemType === 'hygiene') {
    
      const removedItem = hygieneItems[index];
      console.log(`Removed hygiene item: ${removedItem.name}`)
      const updatedItems = hygieneItems.filter((item, i) => i !== index);
      setHygieneItems(updatedItems);
    } 
  };

  const handleEnterKey = (e, itemType) => {

    if (e.key === 'Enter'){
      if (itemType === 'general'){
        handleAddGeneralItem();
      } else if (itemType === 'hygiene'){
        handleAddHygieneItem();
      }
    }
  };

  useEffect(() => {

    axios.get('http://localhost:3001/orderforms', {})
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err)
      })
  }, [])
  const submitOrder = async (items) => {

    try {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString(); // Get formatted date (day/month/year)
      const response = await axios.post(`${serverUrl}/orderforms`, {
          items: items.map(item => ({
            name: item.name,
            quantity: item.quantity,
            status: item.status,
            type: item.type,
            postDate: formattedDate,
          })),
      });
      console.log(response)
      let generalSuccess = false;
      let hygieneSuccess = false; // may show warning here but there should be none

      items.forEach(item => {
        if (item.type === 'general') {
          generalSuccess = true;
        }
        if (item.type ==='hygiene') {
          hygieneSuccess = true;
        }
      });

      if (generalSuccess){
        setGeneralSuccessMessage(true);
      }
      else {
        setHygieneSuccessMessage(true);
      }
      } catch (error) {
      // Handle error...
      console.error('Error submitting order:', error); // Handle unexpected errors if needed
    }
  } 
/*add something to edit quantities */
  return (
  
    <div className="list-container">
      <div className="custom-list-border">
        <div className = "mainHeadersText">General</div>
        <div className="addItemsContainer">

        <input className="addItem"
          type="text"
          value={newGeneralItem}
          onChange={(e) => setNewGeneralItem(e.target.value)}
          placeholder='Item Name'
        />

        <input className="addItem"
            type="number"
            value={newGeneralItemQuantity}
            onChange={(e) => setNewGeneralItemQuantity(Math.max(0, parseInt(e.target.value)))}
            placeholder="Quantity"
            onKeyDown ={(e) => handleEnterKey(e, 'general')}
          />
        <button className="addItemButton" onClick={handleAddGeneralItem} disabled={!(newGeneralItem.trim() !== '' && newGeneralItemQuantity > 0)}>Add General Item</button>
        </div>
        <ul className= "items-list">
          {generalItems.map((item, index) => (
            <div key={index}>
              <li key={index} className="items-container"> {/* live element */}
                <h3 className="listItem"> {item.name} (Quantity: {item.quantity}) </h3><button className="removeButton" onClick={() => handleRemoveItem(index, 'general')}>Remove</button>
              </li>
            </div>
          ))}
        </ul>
          <button className="submitOrderButton" onClick={() => {
            submitOrder(generalItems, 'general');
            console.log(`Order Submitted: ${generalItems.name}`);
            setGeneralItems([]);
            setTimeout(() => {
              setGeneralSuccessMessage(true);
              setNewGeneralItem('');
              setNewGeneralItemQuantity('');
            }, 300);
            setTimeout(() => {
              setGeneralSuccessMessage(false);
            },5000);
          }}>
            Submit General Items
          </button>
          <div className="containerSubmitandSuccess">
          {showGeneralSuccessMessage && (
          <div className="animation"><p className="successMessage">General Order Successful!</p></div>
        )}
        </div>
      </div>

      <div className="custom-list-border">
        <div className = "mainHeadersText">Hygiene</div>
        <div className="addItemsContainer">
        <input className="addItem"
          type="text"
          value={newHygieneItem}
          onChange={(e) => setNewHygieneItem(e.target.value)}
          placeholder='Item Name'
        />
         <input className="addItem"
            type="number"
            value={newHygieneItemQuantity}
            onChange={(e) => setNewHygieneItemQuantity(Math.max(0, parseInt(e.target.value)))}
            onKeyDown={(e) => handleEnterKey(e,'hygiene')}
            placeholder="Quantity"
          />
        <button className="addItemButton" onClick={handleAddHygieneItem} disabled={!(newHygieneItem.trim() !== '' && newHygieneItemQuantity > 0)}>Add Hygiene Item</button>
        </div>
        <ul className="items-list">
          {hygieneItems.map((item, index) => (
            <div key={index}>
              <li key={index} className="items-container">
                <h3 className="listItem"> {item.name} (Quantity: {item.quantity}) </h3><button className="removeButton" onClick={() => handleRemoveItem(index, 'hygiene')}>Remove</button>
              </li>
            </div>
          ))}
        </ul>     
        <button className="submitOrderButton" onClick={() => {
          submitOrder(hygieneItems, 'hygiene');
          console.log(`Order Submitted: ${hygieneItems.name}`);
          setHygieneItems([]);
          setTimeout(() => {
            setHygieneSuccessMessage(true);
            setNewHygieneItem('');
            setNewHygieneItemQuantity('');
          }, 300);
          setTimeout(() => {
            setHygieneSuccessMessage(false);
          }, 5000);
        }}>
          Submit Hygiene Items
        </button>
        <div className="containerSubmitandSuccess">
          {showHygieneSuccessMessage && (<div className="animation"><p className="successMessage">Hygiene Order Successful!</p></div>
        )}
        </div>
      </div>
  </div>
  );
};

export default SendOrderPage;