//CheckOrderPage.js
import React from 'react';

// const [orderforms, setOrderforms] = useState([]);

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
  return (
      <div className="checkOrderBorder">
        <div className="containerCheckHeader">
          <div className = "mainHeadersText">Check Order</div>
        </div>
      </div>
  );
};

export default CheckOrderPage;
