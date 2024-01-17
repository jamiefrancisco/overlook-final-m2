// Imports 

import './css/styles.css';
import './images/motel.png'

import { fetchData, postNewBooking } from './apiCalls';
import { getCustomerBookings, sortBookingsByDate, calculateTotalCost } from './customerBookings';
import { login } from './login.js';
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
const totalSpentContainer = document.querySelector('.total-spent-container');
const availableRoomsList = document.getElementById('available-rooms-list');
const successMessage = document.querySelector('.success-message');


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
  show(logOutBtn);
  show(bookRoomsBtn);
  show(bookingsContainer);
  show(totalSpentContainer);
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
  show(availableRoomsList);
});

bookRoomsBtn.addEventListener('click', () => {
  show(bookingForm);
  hide(bookingsContainer);
  hide(bookRoomsBtn);
  show(viewBookingsBtn);
  hide(availableRoomsList);
  hide(successMessage);
  hide(totalSpentContainer);
});

viewBookingsBtn.addEventListener('click', () => {
  hide(bookingForm);
  show(bookingsContainer);
  show(bookRoomsBtn)
  hide(viewBookingsBtn);
  hide(successMessage);
  show(totalSpentContainer);

});

logOutBtn.addEventListener('click', () => {
  hide(bookingForm);
  hide(bookingsContainer);
  hide(bookRoomsBtn);
  hide(viewBookingsBtn);
  hide(totalSpentContainer);
  show(loginPage);
  hide(logOutBtn);
  hide(successMessage);
  hide(availableRoomsList);
  clearLoginForm();
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
  availableRoomsList.innerHTML = '';

  if (availableRooms.length === 0) {
    availableRoomsList.innerHTML = '<p class="centered-message">No rooms available for the selected date and type.</p>';
    return;
  }

  availableRooms.forEach(room => {

    const roomElement = document.createElement('div');
    roomElement.classList.add('room');
    roomElement.innerHTML = `
      <h4>Room ${room.number}</h4>
      <p>Type: ${room.roomType}</p>
      <p>Bed Size: ${room.bedSize}</p>
      <p>Number of Beds: ${room.numBeds}</p>
      <p>Cost per Night: $${room.costPerNight.toFixed(2)}</p>
      <button class="book-room-btn">Book Room</button>
    `;


    availableRoomsList.appendChild(roomElement);


    const bookButton = roomElement.querySelector('.book-room-btn');
    bookButton.addEventListener('click', () => {
      postNewBooking(currentCustomer.id, selectedDate, room.number)
        .then(response => {
          const newBooking = response.newBooking;
          bookingsData.push(newBooking);
          const customerBookings = getCustomerBookings(currentCustomer.id, bookingsData);
          displayCustomerBookings(customerBookings);
          const totalSpent = calculateTotalCost(customerBookings, roomsData);
          displayTotalSpent(totalSpent);

          hide(availableRoomsList);
          show(bookRoomsBtn);
          hide(bookingForm);

          successMessage.textContent = `You have successfully booked room ${room.number} on ${selectedDate}.`;
          show(successMessage);
        })
        .catch(error => {
          console.error('Error booking room:', error);
        });
    });
  });
}

function handleLogin(username, password) {
  loginErrorMessage.textContent = '';
  hide(loginErrorMessage);

  const loginResult = login(customersData, username, password);
  if (loginResult.success) {
    hide(loginPage);
    show(userDashboard);

    currentCustomer = loginResult.customer;
    const customerBookings = getCustomerBookings(currentCustomer.id, bookingsData);
    displayCustomerBookings(customerBookings);

    const totalSpent = calculateTotalCost(customerBookings, roomsData);
    displayTotalSpent(totalSpent);
  } else {
    loginErrorMessage.textContent = loginResult.message;
    show(loginErrorMessage);
    loginPage.appendChild(loginErrorMessage);
  }
}

function displayTotalSpent(totalSpent) {
  const totalSpentElement = document.getElementById('total-spent');
  totalSpentElement.textContent = `Total Spent: $${totalSpent.toFixed(2)}`;
}

// Helper Functions

function clearLoginForm() {
  const loginForm = document.getElementById('login-form');
  loginForm.reset();
}

function show(element) {
  element.classList.remove('hidden');
}

function hide(element) {
  element.classList.add('hidden');
}