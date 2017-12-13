const { expect } = require('chai');

const nestArray = require('./nest-array');


describe('nestArray', () => {
  it('returns the array if the length is 0', () => {
    const array = [1, 2, 3];
    const expectArray = [1, 2, 3];
    const length = 0;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns the array if the length is less than 0', () => {
    const array = [1, 2, 3];
    const expectArray = [1, 2, 3];
    const length = -100;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is even and the array length is odd', () => {
    const array = [1, 2, 3];
    const expectArray = [[1, 2], [3]];
    const length = 2;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is odd and the array length is even', () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const expectArray = [[1, 2, 3], [4, 5, 6], [7]];
    const length = 3;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is equal to the array length', () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const expectArray = [[1, 2, 3, 4, 5, 6, 7]];
    const length = 7;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is 2 and the array length is 7', () => {
    const array = [1, 2, 3, 4, 5, 6, 7];
    const expectArray = [[1, 2], [3, 4], [5, 6], [7]];
    const length = 2;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is 5 and the array length is 17', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
    const expectArray = [[1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17]];
    const length = 5;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is 1 and the array length is 1', () => {
    const array = [1];
    const expectArray = [[1]];
    const length = 1;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is 9 and the array length is 9', () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const expectArray = [[1, 2, 3, 4, 5, 6, 7, 8, 9]];
    const length = 9;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

  it('returns a correct nested array if the length is 10 and the array length is 2', () => {
    const array = [1, 2];
    const expectArray = [[1, 2]];
    const length = 10;
    expect(nestArray(length, array)).to.deep.equal(expectArray);
  });

});
