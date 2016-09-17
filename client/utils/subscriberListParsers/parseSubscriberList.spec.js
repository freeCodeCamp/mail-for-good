import { expect } from 'chai';
import parseSubscriberListCsv from './parseSubscriberList';

const sampleDataNormalData = `nreid0@domainmarket.com,Female,Nancy,Reid,Virginia,Plaza
bbrooks1@about.me,Female,Bonnie,Brooks,Florida,Circle
khanson5@amazon.co.jp,Male,Keith,Hanson,California,Pass
jgrant6@hexun.com,Female,Julia,Grant,Georgia,Drive`;

const sampleDataNormalExpected = {
  subscribers: [
    {email: 'nreid0@domainmarket.com', gender: 'Female', firstName: 'Nancy', lastName: 'Reid', state: 'Virginia', streetType: 'Plaza'},
    {email: 'bbrooks1@about.me', gender: 'Female', firstName: 'Bonnie', lastName: 'Brooks', state: 'Florida', streetType: 'Circle'},
    {email: 'khanson5@amazon.co.jp', gender: 'Male', firstName: 'Keith', lastName: 'Hanson', state: 'California', streetType: 'Pass'},
    {email: 'jgrant6@hexun.com', gender: 'Female', firstName: 'Julia', lastName: 'Grant', state: 'Georgia', streetType: 'Drive'},
  ],
  fields: {email: 'email', gender: 'text', firstName: 'text', lastName: 'text', state: 'group', streetType: 'group'},
}

const sampleDataNormalFields = {
  email: 'email',
  gender: 'text',
  firstName: 'text',
  lastName: 'text',
  state: 'group',
  streetType: 'group'
}

describe('parseSubscriberList', () => {
  it('parsers columns based on the field object', () => {
    const result = parseSubscriberListCsv(sampleDataNormalData, sampleDataNormalFields);

    expect(result).to.deep.equal(sampleDataNormalExpected);
  })

  it('if the csv is invalid, the offending rows should be returned with an error object', () => {
  })
})

