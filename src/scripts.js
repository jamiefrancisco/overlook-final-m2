// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/motel.png'

import { fetchData } from './apiCalls';
import { getCustomerBookings, calculateTotalCost } from './customerBookings';
import { validateUsernameAndGetId, validatePassword, login } from './login.js';

console.log('This is the JavaScript entry file - your code begins here.');


// Query Selectors 

const loginForm = document.getElementById('login-form');
const loginPage = document.getElementById('login-page');
const userDashboard = document.querySelector('.user-dashboard');
const loginErrorMessage = document.createElement('p'); // Create an element to show login errors



// All Data 

// Global Variables

let customersData, bookingsData, roomsData;
let currentCustomer;

// Event Listeners


window.addEventListener('load', () => {
  Promise.all([
    fetchData('customers'),
    fetchData('bookings'),
    fetchData('rooms')
  ])
    .then(([customersResponse, bookingsResponse, roomsResponse]) => {
      customersData = customersResponse.customers;
      bookingsData = bookingsResponse.bookings;
      roomsData = roomsResponse.rooms;
      console.log(customersData, bookingsData, roomsData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
});


loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username-input').value;
  const password = document.getElementById('password-input').value;

  handleLogin(username, password);
});




// 


function displayCustomerBookings(customerBookings) {
  const today = new Date();
  const upcomingBookingsList = document.getElementById('upcoming-bookings-list');
  const pastBookingsList = document.getElementById('past-bookings-list');

  upcomingBookingsList.innerHTML = '';
  pastBookingsList.innerHTML = '';

  customerBookings.forEach(booking => {
    const bookingDate = new Date(booking.date);
    const roomDetails = roomsData.find(room => room.number === booking.roomNumber);

    const bedOrBeds = roomDetails.numBeds === 1 ? 'bed' : 'beds';

    const bookingElement = document.createElement('div');
    bookingElement.classList.add('booking');
    bookingElement.innerHTML = `
      <p>Date: ${booking.date}</p>
      <p>Room Number: ${booking.roomNumber}</p>
      <p>Room Type: ${roomDetails.roomType}</p>
      <p>${roomDetails.numBeds} ${roomDetails.bedSize} ${bedOrBeds}</p>
    `;

    if (bookingDate >= today) {
      upcomingBookingsList.appendChild(bookingElement);
    } else {
      pastBookingsList.appendChild(bookingElement);
    }
  });
}



function handleLogin(username, password) {
  const loginResult = login(customersData, username, password);
  if (loginResult.success) {
    loginPage.classList.add('hidden');
    userDashboard.classList.remove('hidden');

    currentCustomer = loginResult.customer;
    const customerBookings = getCustomerBookings(currentCustomer.id, bookingsData);
    displayCustomerBookings(customerBookings);
  } else {
    loginErrorMessage.textContent = loginResult.message;
    loginErrorMessage.classList.remove('hidden');
    loginPage.appendChild(loginErrorMessage);
  }
}

