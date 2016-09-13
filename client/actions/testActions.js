import { TEST_ACTION } from '../constants/actionTypes';

export function testAction(data) {
  return {
    type: TEST_ACTION,
    payload: {
      data
    }
  };
}
