function fetchData(data) {
  return fetch(`http://localhost:3001/api/v1/${data}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error(`Error fetching ${data}:`, error);
    });
}

function postNewBooking(userId, date, roomNumber) {
  const url = 'http://localhost:3001/api/v1/bookings';

  const formattedDate = date.replace(/-/g, '/');

  const requestData = {
    userID: userId,
    date: formattedDate,
    roomNumber: roomNumber
  };

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      return response.text().then(text => {
        console.error('Booking response error:', text);
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      });
    }
    return response.json();
  })
  .then(data => {
    return data;
  })
  .catch((err) => {
    console.error('Error making booking:', err);
    throw err;
  });
}

export { fetchData, postNewBooking };
