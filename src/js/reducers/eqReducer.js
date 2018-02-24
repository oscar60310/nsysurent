import moment from 'moment';

export default function reducer(state =
  {
    eqList: [],
    loading: 0,
    error: null,
    pickEq: null,
    pickDate: moment(),
    rentList: [],
  }, action) {
  switch (action.type) {
    case 'GET_EQLIST_PENDING': {
      return { ...state, loading: state.loading + 1 };
    }
    case 'GET_EQLIST_REJECTED': {
      return { ...state, loading: state.loading - 1, error: action.payload };
    }
    case 'GET_EQLIST_FULFILLED': {
      return {
        ...state,
        loading: state.loading - 1,
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
    case 'GET_RENT_PENDING': {
      return { ...state, loading: state.loading + 1 };
    }
    case 'GET_RENT_REJECTED': {
      return { ...state, loading: state.loading - 1, error: action.payload };
    }
    case 'GET_RENT_FULFILLED': {
      return {
        ...state,
        loading: state.loading - 1,
        rentList: action.payload.data.res,
      };
    }

    default: break;
  }

  return state;
}
