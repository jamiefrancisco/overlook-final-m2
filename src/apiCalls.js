

function fetchData(data) {
  return fetch(`http://localhost:3001/api/v1/${data}`)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}


export { fetchData };