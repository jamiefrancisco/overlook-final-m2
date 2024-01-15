function validateUsernameAndGetId(username) {
  const usernamePrefix = 'customer';
  if (username.startsWith(usernamePrefix) && username.length === usernamePrefix.length + 2) {
    const customerId = parseInt(username.slice(usernamePrefix.length), 10);
    // The customerId should be returned regardless of whether it exists in the data
    return customerId;
  }
  return null; // Return null if the username is invalid
}

function validatePassword(password) {
  const expectedPassword = 'overlook2021';
  return password === expectedPassword;
}

function login(customersData, username, password) {
  const customerId = validateUsernameAndGetId(username);
  if (customerId === null) {
    return { success: false, message: 'Incorrect username or password.' };
  }

  const customer = customersData.find(customer => customer.id === customerId);
  if (!customer) {
    return { success: false, message: 'No such customer.' };
  }

  if (validatePassword(password)) {
    return { success: true, customer };
  } else {
    return { success: false, message: 'Incorrect username or password.' };
  }
}



export { validateUsernameAndGetId, validatePassword, login }
