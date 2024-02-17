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
        const inputFormats = [ //have to change the users input because it can be written multiple ways, so what we do is we convert the users input into our db format, then editing the db format to not include MM:ss to check if its the same and then we reformat it to be user readable
          'YYYY-MM-DD',
          'MM-DD-YYYY',
          'MM DD YYYY',
          'MMM DD YYYY',
          'MMM Do YYYY',
          'MMM Do YY',
          'YYYY-MM-DD HH:mm:ss'
        ]
        const parsedInputDate = moment(value, inputFormats, true).format('YYYY-MM-DD');;
        const parsedDbDate = moment(item.postDate, inputFormats, true).format('YYYY-MM-DD');;

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
