//CheckOrderPage.js
import React, {useState} from 'react';
import moment from 'moment';
import mockData from './mock-data.json';
//const [orderforms, setOrderforms] = useState([]);

// useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`${serverUrl}/orderforms`);
//       setOrderforms(response.data);
//     } catch (error) {
//       console.error('Error fetching order forms:', error);
//     }
//   };
// })

const CheckOrderPage = ({ setCurrentPage }) => {

  const[value, setValue] = useState('');
  const[searchResults, setSearchResults] = useState([]);

  const onChange = (event) => {
    setValue(event.target.value);
  }

  const onSearch = () => {
    console.log('search value', value);
    const results = mockData.filter((item) => {
    
      try {
        const inputFormats = [ // all possible "common" combinations that a user might type
          'MM/DD/YYYY',
          'MM-DD-YYYY',
          'MM DD YYYY',
          'MMM DD, YYYY',
          'MMM D, YYYY',
          'MMM YYYY',
          'MM-YYYY',
          'MM YYYY',
          'YYYY',
          'YY',
          'YYYY-MM-DD',
          'YYYY/MM/DD',
          'DD/MM/YYYY',
          'DD.MM.YYYY',
          'DD MM YYYY',
          'D MMM YYYY',
          'D MMM, YYYY',
          // 'DD MMM',
          'D/MM/YYYY',
          'D.MM.YYYY',
          'D MM YYYY',
          'YYYY-MM-DD HH:mm:ss', //special case for our database data only
        ]

        /*
        fix to consider all possible dates, account forthese combinations:
          - all the dates with a specific month come up 'MM', 'MMM
          - all the dates with a specific day come up 'DD', 'D', 
          - all the dates with a specifc day and month come up 'DD/MM', 'D/MM', 'D.MM', etc.
          - all the dates with a specific month and year come up 'MM/'YY', 'MM YY', 'MMM YY', 'MM/YYYY', etc.
          - all the dates with a specifc day, month, and year ocme up 'DD-MM-YYYY', 'DD MM YY', 'D/MM/YYYY', 'DD-MMM-YYYY', etc.
        */
        const parsedInputDate = moment(value, inputFormats, true).format('YYYY-MM');
        const parsedDbDate = moment(item.postDate, inputFormats, true).format('YYYY-MM');

        console.log('input', parsedInputDate);
        console.log('db', parsedDbDate);
          
        if (moment(parsedInputDate).isValid() && moment(parsedInputDate).isSame(parsedDbDate, 'day')) {
          // Return true if the parsedDate matches the setDate (same day)
          return true;

        } else{
          return false;
        }
      } catch (error) {
        console.error('Error formatting date:', error);
        return false; // Exclude the item from results if there's an error
      }
    });

    setSearchResults(results);
    console.log('searching', { results })
  }
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };
  const groupByDate = (data) => {

    const grouped = {};

    data.forEach((item) => {
      const date = moment(item.postDate).format('MMM Do YYYY'); //format the date before showing output
      if (grouped[date]) {
        grouped[date].push(item);
      } else{
        grouped[date] = [item]
      }
    });
    return grouped;
  }
  const groupedData = groupByDate(searchResults);
  return (
      <div className="checkOrderBorder">
        <div className="containerCheckHeader">
          <div className = "mainHeadersText">Check Order</div>  
          <div className ="topnav">
            <div className = "search-inner">
                <input className="navinput" type="text" value = {value} onChange={onChange} onKeyDown={handleKeyPress} placeholder="Search.."></input>
                <button className="checkOrderSearch" onClick={onSearch}>Search</button>
              </div>
              <div className="dropdown">
                  {Object.keys(groupedData).map((date, index) => (
                    <div key={index}>
                      <div className="dropdown-date">{date}</div>
                      {groupedData[date].map((item, subIndex) => (
                        <div className="dropdown-row" key={subIndex}>
                          {item.postDate}
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
          </div>
        </div>
      </div>
  );
};

export default CheckOrderPage;
