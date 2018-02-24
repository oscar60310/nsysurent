import moment from 'moment';

export default function reducer(state =
  {
    eqList: [],
    loading: false,
    error: null,
    pickEq: null,
    pickDate: moment(),
  }, action) {
  switch (action.type) {
    case 'GET_EQLIST_PENDING': {
      return { ...state, loading: true };
    }
    case 'GET_EQLIST_REJECTED': {
      return { ...state, loading: false, error: action.payload };
    }
    case 'GET_EQLIST_FULFILLED': {
      return {
        ...state,
        eqList: action.payload.data,
      };
    }
    case 'PICK_EQUIPMENT': {
      return {
        ...state,
        pickEq: action.payload,
      };
    }
    case 'PICK_DATE': {
      return {
        ...state,
        pickDate: action.payload,
      };
    }
    default: break;
  }

  return state;
}
