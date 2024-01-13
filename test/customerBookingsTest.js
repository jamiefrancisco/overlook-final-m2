import chai from 'chai';
const expect = chai.expect;

import { sampleData } from '../test/sampleData.js';
import { getCustomerBookings, calculateTotalCost } from '../src/customerBookings.js'

describe('getCustomerBookings', () => {
  it('should return all bookings for a customer with multiple bookings', () => {
    const customerId = 1;
    const expectedBookings = [
      { "id": "5fwrgu4i7k55hl6sz", "userID": 1, "date": "2022/04/22", "roomNumber": 1 },
      { "id": "5fwrgu4i7k55hl6t8", "userID": 1, "date": "2023/01/25", "roomNumber": 1 }
    ];
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    expect(customerBookings).to.deep.equal(expectedBookings);
  });

  it('should return a single booking for a customer with one booking', () => {
    const customerId = 5;
    const expectedBookings = [
      {"id": "5fwrgu4i7k55hl6t7", "userID": 5, "date": "2023/01/19", "roomNumber": 5}
    ];
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    expect(customerBookings).to.deep.equal(expectedBookings);
  });

  it('should return an empty array for a customer with no bookings', () => {
    const customerId = 55;
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    expect(customerBookings).to.be.an('array').that.is.empty;
  });

  it('should handle invalid customer ID types', () => {
    const invalidCustomerIds = [null, undefined, 'string', {}, []];
    invalidCustomerIds.forEach(invalidId => {
      const customerBookings = getCustomerBookings(invalidId, sampleData.bookings);
      expect(customerBookings).to.be.an('array').that.is.empty;
    });
  });

  it('should return an empty array if the bookings data is empty', () => {
    const customerId = 1;
    const customerBookings = getCustomerBookings(customerId, []);
    expect(customerBookings).to.be.an('array').that.is.empty;
  });

});

describe('calculateTotalCost', () => {
  
  it('should calculate the total cost for a customer with multiple bookings', () => {
    const customerId = 1;
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    const totalCost = calculateTotalCost(customerBookings, sampleData.rooms);
    const expectedCost = 358.4 * 2;
    expect(totalCost).to.equal(expectedCost);
  });

  it('should calculate the total cost for a customer with a single booking', () => {
    const customerId = 5;
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    const totalCost = calculateTotalCost(customerBookings, sampleData.rooms);
    const expectedCost = 340.17;
    expect(totalCost).to.equal(expectedCost);
  });

  it('should return 0 if the customer has no bookings', () => {
    const customerId = 55;
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    const totalCost = calculateTotalCost(customerBookings, sampleData.rooms);
    expect(totalCost).to.equal(0);
  });

  it('should return 0 if the bookings array is empty', () => {
    const totalCost = calculateTotalCost([], sampleData.rooms);
    expect(totalCost).to.equal(0);
  });

  it('should handle cases where the room for a booking is not found', () => {
    const customerId = 1;
    const customerBookings = getCustomerBookings(customerId, sampleData.bookings);
    const modifiedRooms = sampleData.rooms.filter(room => room.number !== customerBookings[0].roomNumber);
    const totalCost = calculateTotalCost(customerBookings, modifiedRooms);
    expect(totalCost).to.equal(0);
  });
});