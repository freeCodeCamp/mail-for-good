/**
 * @description Converts an array into a nested array where nested array are of the {length} parameter
 * @param {number} length - The length of each nested array
 * @param {array} array - The array to act on
 * @return {array} Nested array
 * @example nestArray(2, [1,2,3,4,5,6,7]) returns [[1,2], [3, 4], [5, 6], [7]]
 */

module.exports = (length, array) => {
  if (length <= 0) {
    return array;
  }
  if (length > array.length) {
    return [array];
  }

  let tempArray = [];
  const newArray = [];

  array.forEach((item, index) => {
    tempArray.push(item);
    if ((index + 1) % length === 0) {
      newArray.push(tempArray);
      tempArray = [];
    }
    else if (index === array.length - 1) {
      newArray.push(tempArray);
    }
  });

  return newArray;
};
