function getCustomerBookings(customerId, bookings) {
  const customerBookings = bookings.filter(booking => customerId === booking.userID);
  return customerBookings;
}

function sortBookingsByDate(bookings) {
  const today = new Date();

  let upcomingBookings = [];
  let pastBookings = [];

  bookings.forEach(booking => {
    const bookingDate = new Date(booking.date);

    if (bookingDate >= today) {
      upcomingBookings.push(booking);
    } else {
      pastBookings.push(booking);
    }
  });

  upcomingBookings.sort((a, b) => new Date(a.date) - new Date(b.date));
  pastBookings.sort((a, b) => new Date(b.date) - new Date(a.date));

  return { upcomingBookings, pastBookings };
}

function calculateTotalCost(bookings, rooms) {
  const totalCost = bookings.reduce((total, booking) => {
    const room = rooms.find(room => room.number === booking.roomNumber);
    if (room) {
      return total + room.costPerNight;
    }
    return total;
  }, 0);
  return totalCost;
}


export { getCustomerBookings, sortBookingsByDate, calculateTotalCost }