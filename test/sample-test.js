import chai from 'chai';
const expect = chai.expect;

import { sampleData } from '../test/sampleData.js';
import { getCustomerBookings, calculateTotalCost } from '../src/getCustomerBookings.js'

describe('See if the tests are running', function() {
  it('should return true', function() {
    expect(true).to.equal(true);
  });
});

describe('getCustomerBookings', () => {
  it('should return all bookings for a given customer', () => {
    const customerId = 1;
    const expectedBookings = sampleData.bookings.filter(booking => booking.userID === customerId);
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    expect(customerBookings).to.deep.equal(expectedBookings);
  });

  it('should return an empty array if the customer has no bookings', () => {
    const customerId = 55;
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    expect(customerBookings).to.be.an('array').that.is.empty;
  });
});

