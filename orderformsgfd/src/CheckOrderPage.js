//CheckOrderPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
const serverUrl = 'http://localhost:3001';


const CheckOrderPage = ({ setCurrentPage }) => {
  const[searchResults, setSearchResults] = useState([]); //sets the search results for the post dates of our data
  const[searchButtonClick, setSearchButtonClick] = useState(false); //resets the dropdown for the search results to empty when date is selected
  
  const[headDate, setHeadDate] = useState(''); //sets the date header

  const[headText, setHeadText] = useState([]); //sets lables for table
  const[itemInfo, setItemInfo] = useState([]); //all the item object information 
  // use states for editing the quantity in the table below
  const[editingQuantityItem, setEditingQuantityItem] = useState(null); //sets the value of quantity that user wants to edit, also edits the state between having an input field or not
  const[newItemQuantity, setNewItemQuantity] = useState(''); //sets the new value of item quantity
  const[itemData, setItemData] = useState([]); // used to set the dates in the search bar
  const[showQuantityMessage, setQuantityMessage] = useState(false); //success message after item quantity is saved

  // use states for editing the status in the table below
  const[editingStatusItem, setEditingStatusItem] = useState(null); //sets the value of status that user wants to edit, also edits the state between having an input field or not
  const[selectedStatus, setSelectedStatus] = useState('sent');//initialize the first state as sent so that user does not cause null issue when updating
  const[showStatusMessage, setStatusMessage] = useState(false);

  const setData = async () => {
    try {
      const response = await axios.get(`${serverUrl}/orderforms/`);
      setItemData(response.data); // Update the state with the response data
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setData();
  }, []);

  const onSearch = () => {

    setSearchResults(searchButtonClick ? [] : itemData); //sets the search results bar with dates
    setSearchButtonClick(!searchButtonClick); //resets the search button click
  };
  
  const groupByDate = (data) => { //function that groups items by date in a dictionary

    const grouped = {};

    data.forEach((item) => {
      const date = moment(item.postDate).format('MMM/DD/YYYY') //have to format the date because we do not want MM:ss
      //format the date before showing output
      if (grouped[date]) {
        grouped[date].push(item); //groups items in a key value pair for all the dates with the same date
      } else{
        grouped[date] = [item]
      }
    });
    return grouped; //returns the data grouped by its date
  }
  const groupedData = groupByDate(searchResults); //set the groupedData as dates in search results immediately as the page renders
  

  const handleDataClicked = (date) => { //handles the date that was clicked 
    console.log("Date clicked:", date);

    const headDate = moment(date, 'MMM/DD/YYYY').format('MMM DD, YYYY')//format the dates to a more readable format in my opinion
    setHeadDate(headDate);//set the date header
    
    setSearchResults([]); //empty the search results
    setSearchButtonClick(false); //reset search button
    setItemInfo(groupedData[date]); //setst the items information to all the grouped date found within that date
    const items = groupedData[date]; //idk yet if im going to use this

    setHeadText(["Name", "Quantity", "Type", "Status"]); //sets the headers for the table
  };

  const editItemQuantity = async (item, editingQuantityItem, newItemQuantity) => { //edits the quantity, takes in our item object, the id (just to make sure), and the new quantity 
    try {
      const updatedData = {
          id: editingQuantityItem, //set to item id
          quantity: newItemQuantity, //set to new quantity
          // status: newItemStatus,
      };
      console.log(`Editing quantity of ${item.name}: id ${editingQuantityItem}`); //log to check what we edited
      const response = await axios.put(`${serverUrl}/orderforms/${editingQuantityItem}`, { items: [updatedData] }); //send post order to the server
      console.log('Console responded with:',JSON.stringify(response.data)); //receive the reponse and log it
      item.quantity = newItemQuantity; //set the item quantity to new value after posting it, so when it is switched back to the field it displays that
      
  } catch(err) {
    if (err.response) {
      // The request was made, but the server responded with a non-2xx status code
      console.error('Server responded with error status:', err.response.status);
      console.error('Response data:', err.response.data);
  } else if (err.request) {
      // The request was made but no response was received
      console.error('No response received:', err.request);
  } else {
      // Something happened in setting up the request that triggered an error
      console.error('Error setting up request:', err.message);
  }
  }
  }
  const editStatusValue = (event) => { //sets the item status to whatever option they select
    setSelectedStatus(event.target.value);
    console.log(selectedStatus)
  };

  const editItemStatus = async (selectedStatus, item) => { //sending new status to database
    const updatedData = { //initialize id and status
      id: item.id,
      status: selectedStatus,
    }
    try { //try to send to database
      console.log(`Updating item ${item.id} with status ${selectedStatus}`)
      const response = await axios.put(`${serverUrl}/orderforms/${item.id}`, { items: [updatedData] });
      console.log('Console responded with:',JSON.stringify(response.data));
      item.status = selectedStatus; //set the item quantity to new value after posting it, so when it is switched back to the field it displays that

    } catch(err){

      if (err.response) {
        // The request was made, but the server responded with a non-2xx status code
        console.error('Server responded with error status:', err.response.status);
        console.error('Response data:', err.response.data);
    } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
    } else {
        // Something happened in setting up the request that triggered an error
        console.error('Error setting up request:', err.message);
    }
  }
}

  return (
      <div className="checkOrderBorder">
        <div className="containerCheckHeader">
          <p className = "mainHeadersText">Check Order</p>  
          <div className ="topnav">
              <button className={`checkOrderSearch ${searchButtonClick ? 'selected' : ''}`} onClick={onSearch}>Search</button>
              <div className="dropdown">
                {Object.entries(groupedData).map(([date, items]) => (
                  <div 
                    key={date} 
                    className="dropdown-row"
                    onClick={() => handleDataClicked(date)}
                    >
                    {date}
                  </div>
                ))}
              </div>
          </div>
            <p className="dateHeaderContainer">{headDate}</p>
          <table className="checkItemsContainer">
            <thead>
              <tr>
                {headText.map((label, index) => (
                  <td key = {index}> <p className="checkItemText">{label}</p></td>
                ))} 
              </tr>
            </thead>
            <tbody>
              {itemInfo.map((item) => (//renders table row by row with an index on tr (because that renders each row but lets see what we can do)  
              <tr key={item.id}><td key = {`${item.id}_name`}><p className="checkItemText">{item.name}</p></td> 

                <td key = {`${item.id}_quantity`}>
                  {/*thought process is give the button a value tag with the id of the item so that when it is selected we can try to match the value of that button to where it is located in the table to edit only that text field*/}
                    {editingQuantityItem !== item.id ? ( /* created a use state that when a button is clicked it takes the item.id and sets it to the editingQuantityItem then it switches the inptu field because editingQuantityItem is now equal to item.id (false) so we can swtich.*/
                    <div id="quantityButtonUnselected">
                      <>
                      <p id="editQuantityText">{item.quantity}</p> {/*ternary operator to update the item quantity if necessary */}
                      <button id="quantityButtonOff" onClick={() => setEditingQuantityItem(item.id)}></button> {/*attach id of item to the button*/}
                      </>
                    </div> 
                    ) : (  
                      <>
                      <div id="quantityButtonSelected" className={showQuantityMessage ? "successQuantMessageShown" : ""}>
                      <input
                      id="quantityTextField"
                      type="number"
                      placeholder='Quantity...'
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity((Math.max(0, parseInt(e.target.value))))}
                      autoFocus
                      ></input>
                      <button id="quantityButtonOn" onClick={() => setEditingQuantityItem('')}></button> 
                      <button id="saveEditQuantity"  
                        onClick={() => {editItemQuantity(item, editingQuantityItem, newItemQuantity)
                          setTimeout(() => {
                            setQuantityMessage(true);
                          }, 300);
                          setTimeout(() => {
                            setQuantityMessage(false);
                            setEditingQuantityItem('')
                          }, 2000)
                        }} 
                        disabled={!(newItemQuantity.trim !== '' && newItemQuantity > 0)}
                        >
                        Submit
                      </button>
                      </div>
                      {showQuantityMessage && 
                      <div id="animationQuantity"><p id="quantitySuccessMessage">Edit Successful!</p></div>}
                      </>             
                    )}          
                </td>

                <td key = {`${item.id}_type`}><p className="checkItemText">{item.type}</p></td>  
                <td key = {`${item.id}_status`}> {/* similar to the functionality of editing the quantity above */}
                  {editingStatusItem !== item.id ? (
                    <div id="statusButtonUnselected">
                    <>
                      <p id="editStatusText">{item.status}</p>
                      <button id="statusButtonOff" onClick={() => setEditingStatusItem(item.id)}></button>
                    </>
                    </div>
                  ) : (
                    <>
                    <div id="statusButtonSelected" className={showStatusMessage ? "successMessageShown" : ""}>
                      <select id="statusSelect" value={selectedStatus} onChange={editStatusValue}>
                        <option value="sent">sent</option>
                        <option value="in progress">in progress</option>
                        <option value="received">received</option>
                      </select>
                      <button id="statusButtonOn" onClick={() => setEditingStatusItem('')}></button> 
                      <button id="saveEditStatus" onClick={() => {editItemStatus(selectedStatus, item)
                        setTimeout(() => {
                        setStatusMessage(true);  
                        }, 300);
                        setTimeout(() => {
                        setStatusMessage(false);
                        setEditingStatusItem('')
                        }, 2000)
                        }} 
                       >Save</button>
                       </div>
                       {showStatusMessage && 
                        <div id="animationStatus"><p id="statusSuccessMessage">Edit Successful!</p></div>}       
                    </>           
                  )} 
                </td>
              </tr>
              ))}
            </tbody>
          </table>                   
        </div>
      </div>
      
  );
};
export default CheckOrderPage;
