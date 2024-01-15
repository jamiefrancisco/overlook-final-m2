function findAvailableRoomsByDate(date, bookings, rooms) {
  const alreadyBookedRoomsOnDate = bookings.filter(booking => booking.date === date);
  const alreadyBookedRoomNumbers = alreadyBookedRoomsOnDate.map(booking => booking.roomNumber);
  const availableRooms = rooms.filter(room => !alreadyBookedRoomNumbers.includes(room.number));
  return availableRooms;
}

function filterRoomsByRoomType(rooms, roomType) {
  const filteredRooms = rooms.filter(room => room.roomType === roomType);
  return filteredRooms;
}

export { findAvailableRoomsByDate, filterRoomsByRoomType }
