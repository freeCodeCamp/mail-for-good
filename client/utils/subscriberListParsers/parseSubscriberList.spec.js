import { expect } from 'chai';
import parseSubscriberListCsv from './parseSubscriberList';

const sampleDataNormalData = `email,gender,firstName,lastName,state,streetType
nreid0@domainmarket.com,Female,Nancy,Reid,Virginia,Plaza
bbrooks1@about.me,Female,Bonnie,Brooks,Florida,Circle
khanson5@amazon.co.jp,Male,Keith,Hanson,California,Pass
jgrant6@hexun.com,Female,Julia,Grant,Georgia,Drive`;

const sampleDataNormalExpected = {
  data:
   [ { email: 'nreid0@domainmarket.com',
       gender: 'Female',
       firstName: 'Nancy',
       lastName: 'Reid',
       state: 'Virginia',
       streetType: 'Plaza' },
     { email: 'bbrooks1@about.me',
       gender: 'Female',
       firstName: 'Bonnie',
       lastName: 'Brooks',
       state: 'Florida',
       streetType: 'Circle' },
     { email: 'khanson5@amazon.co.jp',
       gender: 'Male',
       firstName: 'Keith',
       lastName: 'Hanson',
       state: 'California',
       streetType: 'Pass' },
     { email: 'jgrant6@hexun.com',
       gender: 'Female',
       firstName: 'Julia',
       lastName: 'Grant',
       state: 'Georgia',
       streetType: 'Drive' } ],
  errors: [],
  meta:
   { delimiter: ',',
     linebreak: '\n',
     aborted: false,
     truncated: false,
     cursor: 266,
     fields:
      [ 'email',
        'gender',
        'firstName',
        'lastName',
        'state',
        'streetType' ]
    }
};


const sampleDataInvalidData = `email,gender,firstName,lastName,state,streetType
nreid0@domainmarket.com,Female,Nancy,Reid,Virginia
bbrooks1@about.me,Female,Bonnie,Brooks,Florida,Circle
khanson5@amazon.co.jp,Male,Keith,Hanson,California,Pass
jgrant6@hexun.com,Female,Grant,Georgia,Drive`;

const sampleDataInvalidExpectedErrors = [
  {code: "TooFewFields", message: "Too few fields: expected 6 fields but parsed 5", row: 0, type: "FieldMismatch"},
  {code: "TooFewFields", message: "Too few fields: expected 6 fields but parsed 5", row: 3, type: "FieldMismatch"},
];

describe('parseSubscriberList', () => {
  it('parses a csv into an object containing subscribers and their fields', () => {
    function mockCallback(result) {
      expect(result).to.deep.equal(sampleDataNormalExpected);
    }

    parseSubscriberListCsv(sampleDataNormalData, mockCallback);
  });

  it('if the csv is invalid, the offending rows should be returned with an error object', () => {
    function mockCallback(result) {
      expect(result.errors).to.deep.equal(sampleDataInvalidExpectedErrors);
    }

    parseSubscriberListCsv(sampleDataInvalidData, mockCallback);
  });
});
