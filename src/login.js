function validateUsernameAndGetId(username) {
  const usernamePrefix = 'customer';
  if (username.startsWith(usernamePrefix) && username.length === usernamePrefix.length + 2) {
    const customerId = parseInt(username.slice(usernamePrefix.length), 10);
    return customerId;
  }
  return null;
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
  if (!customer || !validatePassword(password)) {
    return { success: false, message: 'Incorrect username or password.' };
  }
  return { success: true, customer };
}

export { validateUsernameAndGetId, validatePassword, login }
