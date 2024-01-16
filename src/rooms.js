function findAvailableRoomsByDate(date, bookings, rooms) {
  const alreadyBookedRoomsOnDate = bookings.filter(booking => booking.date === date);
  const alreadyBookedRoomNumbers = alreadyBookedRoomsOnDate.map(booking => booking.roomNumber);
  const availableRooms = rooms.filter(room => !alreadyBookedRoomNumbers.includes(room.number));
  console.log('Selected date:', date);
  console.log('Bookings on selected date:', alreadyBookedRoomsOnDate);
  console.log('Booked room numbers:', alreadyBookedRoomNumbers);
  console.log('Available rooms:', availableRooms);
  return availableRooms;
}

function filterRoomsByRoomType(rooms, roomType) {
  const filteredRooms = rooms.filter(room => room.roomType === roomType);
  return filteredRooms;
}

export { findAvailableRoomsByDate, filterRoomsByRoomType }
