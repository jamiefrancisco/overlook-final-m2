function findAvailableRoomsByDate(date, bookings, rooms) {


  const formattedDate = date.replace(/-/g, '/');

  const alreadyBookedRoomsOnDate = bookings.filter(booking => {
   
    const formattedBookingDate = booking.date.replace(/-/g, '/');
    return formattedBookingDate === formattedDate;
  });


  const alreadyBookedRoomNumbers = alreadyBookedRoomsOnDate.map(booking => booking.roomNumber);


  const availableRooms = rooms.filter(room => !alreadyBookedRoomNumbers.includes(room.number));


  return availableRooms;
}


function filterRoomsByRoomType(rooms, roomType) {
  const filteredRooms = rooms.filter(room => room.roomType === roomType);
  return filteredRooms;
}

export { findAvailableRoomsByDate, filterRoomsByRoomType }
