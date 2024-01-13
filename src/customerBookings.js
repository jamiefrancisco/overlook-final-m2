function getCustomerBookings(customerId, bookings) {
  const customerBookings = bookings.filter(booking => customerId === booking.userID);
  return customerBookings;
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


export { getCustomerBookings, calculateTotalCost }