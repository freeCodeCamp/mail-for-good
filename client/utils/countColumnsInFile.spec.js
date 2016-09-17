import { expect } from 'chai';
import countColumnsIn from './countColumnsInFile';

const sampleDataNormal = `nreid0@domainmarket.com,Female,Nancy,Reid,Virginia,Plaza
bbrooks1@about.me,Female,Bonnie,Brooks,Florida,Circle
khanson5@amazon.co.jp,Male,Keith,Hanson,California,Pass
jgrant6@hexun.com,Female,Julia,Grant,Georgia,Drive`;

describe('countColumnsInFile', () => {
  it('should count the number of columns in a csv file', () => {
    expect(countColumnsIn(sampleDataNormal)).to.equal(6);
  });
  
  it('should count the number of columns in a tsv file', () => {
  })
});
