import chai from 'chai';
const expect = chai.expect;

import { validateUsernameAndGetId, validatePassword, login } from '../src/login';
import { sampleData } from './sampleData';

describe('validateUsernameAndGetId', () => {
  it('should return the correct ID for a valid username', () => {
    expect(validateUsernameAndGetId('customer01')).to.equal(1);
    expect(validateUsernameAndGetId('customer50')).to.equal(50);
  });

  it('should return null for an invalid username', () => {
    expect(validateUsernameAndGetId('invalid')).to.be.null;
    expect(validateUsernameAndGetId('customer')).to.be.null;
    expect(validateUsernameAndGetId('customerXYZ')).to.be.null;
    expect(validateUsernameAndGetId('customer123')).to.be.null;
  });
  
});

describe('validatePassword', () => {
  it('should return true for the correct password', () => {
    expect(validatePassword('overlook2021')).to.be.true;
  });

  it('should return false for an incorrect password', () => {
    expect(validatePassword('wrongpassword')).to.be.false;
  });
});

describe('login', () => {
  it('should return success and customer data for valid credentials', () => {
    const result = login(sampleData.customers, 'customer01', 'overlook2021');
    expect(result.success).to.be.true;
    expect(result.customer).to.deep.equal(sampleData.customers[0]);
  });

  it('should return failure message for non-existent customer', () => {
    const result = login(sampleData.customers, 'customer51', 'overlook2021');
    expect(result).to.deep.equal({ success: false, message: 'Incorrect username or password.' });
  });
  

  it('should return failure message for invalid password', () => {
    const result = login(sampleData.customers, 'customer01', 'wrongpassword');
    expect(result).to.deep.equal({ success: false, message: 'Incorrect username or password.' });
  });

  it('should return failure message for non-existent customer', () => {
    const result = login(sampleData.customers, 'customer51', 'overlook2021');
    expect(result).to.deep.equal({ success: false, message: 'Incorrect username or password.' });
  });  
});
