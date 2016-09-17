import _ from 'lodash';

export default function deepFillArray (size, element) {
  // Fill an array of ->size with deep cloned ->element(s)
  let array = [];
  for (let i = 0; i < size; i++ ) {
    array.push(_.cloneDeep(element));
  }

  return array;
}
