import chai from 'chai';
const expect = chai.expect;

import { sampleData } from '../test/sampleData.js';
import { findAvailableRoomsByDate, filterRoomsByRoomType } from '../src/rooms.js';


describe('findAvailableRoomsByDate', () => {
  it('should return all available rooms for a given date', () => {
    const date = '2022/04/22';
    const availableRooms = findAvailableRoomsByDate(date, sampleData.bookings, sampleData.rooms);
    const expectedRooms = [
      {"number": 3, "roomType": "single room", "bidet": false, "bedSize": "king", "numBeds": 1, "costPerNight": 491.14},
      {"number": 4, "roomType": "junior suite", "bidet": true, "bedSize": "queen", "numBeds": 1, "costPerNight": 429.44},
      {"number": 5, "roomType": "junior suite", "bidet": false, "bedSize": "queen", "numBeds": 2, "costPerNight": 340.17}
    ];
    expect(availableRooms).to.deep.equal(expectedRooms);
  });

  it('should return all rooms if none are booked on a given date', () => {
    const date = '2023/12/25';
    const availableRooms = findAvailableRoomsByDate(date, sampleData.bookings, sampleData.rooms);
    const expectedRooms = sampleData.rooms;
    expect(availableRooms).to.deep.equal(expectedRooms);
  });
});

describe('filterRoomsByRoomType', () => {
  it('should return rooms filtered by room type', () => {
    const roomType = 'suite';
    const filteredRooms = filterRoomsByRoomType(sampleData.rooms, roomType);
    const expectedRooms = [
      {"number": 2, "roomType": "suite", "bidet": false, "bedSize": "full", "numBeds": 2, "costPerNight": 477.38}
    ];
    expect(filteredRooms).to.deep.equal(expectedRooms);
  });

  it('should return an empty array if no rooms match the room type', () => {
    const roomType = 'nonexistent';
    const filteredRooms = filterRoomsByRoomType(sampleData.rooms, roomType);
    const expectedRooms = [];
    expect(filteredRooms).to.deep.equal(expectedRooms);
  });

});
