// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/motel.png'

import { fetchData } from './apiCalls';

console.log('This is the JavaScript entry file - your code begins here.');


// Query Selectors 

// All Data 

// Global Variables

let customersData, bookingsData, roomsData;

// Event Listeners

window.addEventListener('load', () => {
  fetchData('customers')
    .then(data => {
      customersData = data;
      console.log(customersData);
    })
    .catch(error => {
      console.error('Error fetching customers:', error);
    });

  fetchData('bookings')
    .then(data => {
      bookingsData = data;
      console.log(bookingsData);
    })
    .catch(error => {
      console.error('Error fetching bookings:', error);
    });

  fetchData('rooms')
    .then(data => {
      roomsData = data;
      console.log(roomsData);
    })
    .catch(error => {
      console.error('Error fetching rooms:', error);
    });
});
