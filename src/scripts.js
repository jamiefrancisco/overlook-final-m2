// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/motel.png'

import { fetchData, postNewBooking } from './apiCalls';
import { getCustomerBookings, sortBookingsByDate, calculateTotalCost } from './customerBookings';
import { validateUsernameAndGetId, validatePassword, login } from './login.js';
import { findAvailableRoomsByDate, filterRoomsByRoomType } from './rooms';


// Query Selectors 

const loginForm = document.getElementById('login-form');
const loginPage = document.getElementById('login-page');
const userDashboard = document.querySelector('.user-dashboard');
const loginErrorMessage = document.createElement('p');

const bookRoomsBtn = document.querySelector('.book-rooms-btn');
const viewBookingsBtn = document.querySelector('.view-bookings-btn')
const logOutBtn = document.querySelector('.logout-btn')
const bookingForm = document.querySelector('.booking-form');
const bookingsContainer = document.querySelector('.bookings-container');


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

bookRoomsBtn.addEventListener('click', () => {
  bookingForm.classList.toggle('hidden');
  bookingsContainer.classList.add('hidden');
  bookRoomsBtn.classList.add('hidden');
  viewBookingsBtn.classList.remove('hidden');
});

viewBookingsBtn.addEventListener('click', () => {
  hide(bookingForm);
  show(bookingsContainer);
  show(bookRoomsBtn)
  hide(viewBookingsBtn);

});

logOutBtn.addEventListener('click', () => {
  bookingForm.classList.add('hidden');
  bookingsContainer.classList.add('hidden');
  bookRoomsBtn.classList.add('hidden');
  viewBookingsBtn.classList.add('hidden');
  loginPage.classList.remove('hidden');
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const selectedDate = document.getElementById('booking-date').value;
  const selectedRoomType = document.getElementById('room-type').value;

  let availableRooms = findAvailableRoomsByDate(selectedDate, bookingsData, roomsData);

  if (selectedRoomType !== 'any') {
    availableRooms = filterRoomsByRoomType(availableRooms, selectedRoomType);
  }

  displayAvailableRooms(availableRooms, selectedDate);
});

// Event Handlers 

function displayCustomerBookings(customerBookings) {

  const { upcomingBookings, pastBookings } = sortBookingsByDate(customerBookings);

  const upcomingBookingsList = document.getElementById('upcoming-bookings-list');
  const pastBookingsList = document.getElementById('past-bookings-list');

  upcomingBookingsList.innerHTML = '';
  pastBookingsList.innerHTML = '';

  function createBookingElement(booking) {
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
    return bookingElement;
  }


  upcomingBookings.forEach(booking => {
    const bookingElement = createBookingElement(booking);
    upcomingBookingsList.appendChild(bookingElement);
  });

  pastBookings.forEach(booking => {
    const bookingElement = createBookingElement(booking);
    pastBookingsList.appendChild(bookingElement);
  });
}

function displayAvailableRooms(availableRooms, selectedDate) {
  const availableRoomsList = document.getElementById('available-rooms-list');
  availableRoomsList.innerHTML = '';

  if (availableRooms.length === 0) {
    availableRoomsList.innerHTML = '<p>No rooms available for the selected date and type.</p>';
    return;
  }

  availableRooms.forEach(room => {
    const roomElement = document.createElement('div');
    roomElement.classList.add('room');
    roomElement.innerHTML = `
      <h4>Room Number: ${room.number}</h4>
      <p>Room Type: ${room.roomType}</p>
      <p>Price: $${room.costPerNight.toFixed(2)}</p>
      <button type="button" class="book-room-btn">Book Room</button>
    `;

    availableRoomsList.appendChild(roomElement);

    const bookButton = roomElement.querySelector('.book-room-btn');
    bookButton.addEventListener('click', () => {
      postNewBooking(currentCustomer.id, selectedDate, room.number)
        .then(newBookingData => {
          bookingsData.push(newBookingData);

          const customerBookings = getCustomerBookings(currentCustomer.id, bookingsData);
          displayCustomerBookings(customerBookings);

          const totalSpent = calculateTotalCost(customerBookings, roomsData);
          displayTotalSpent(totalSpent);
        })
        .catch(error => {
          console.error('Error updating bookings after new booking:', error);
        });
    });
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


    const totalSpent = calculateTotalCost(customerBookings, roomsData);
    displayTotalSpent(totalSpent);
  } else {
    loginErrorMessage.textContent = loginResult.message;
    loginErrorMessage.classList.remove('hidden');
    loginPage.appendChild(loginErrorMessage);
  }
}


function displayTotalSpent(totalSpent) {
  const totalSpentElement = document.getElementById('total-spent');
  totalSpentElement.textContent = `Total Spent: $${totalSpent.toFixed(2)}`;
}

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}