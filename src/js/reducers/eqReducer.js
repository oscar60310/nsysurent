import moment from 'moment';


export default function reducer(state =
  {
    eqList: [],
    loading: 0,
    error: null,
    pickEq: null,
    pickDate: moment(),
    rentList: [],
    render: '',
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
    case 'RENT': {
      const list = [...state.rentList];
      const index = state.rentList
        .findIndex(x => x.date === action.payload.date && x.time === action.payload.time);
      if (index === -1) {
        list.push({
          now: true,
          date: action.payload.date,
          time: action.payload.time,
          usr: '登記',
        });
      } else if (list[index].now) {
        list.splice(index, 1);
      } else {
        list[index].del = !(list[index].del);
      }
      return {
        ...state,
        rentList: list,
      };
    }
    case 'INPUT_RENDER': {
      return {
        ...state,
        render: action.payload,
      };
    }
    case 'SEND_REQ_PENDING': {
      return { ...state, loading: state.loading + 1 };
    }
    case 'SEND_REQ_REJECTED': {
      return { ...state, loading: state.loading - 1, error: action.payload };
    }
    case 'SEND_REQ_FULFILLED': {
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
