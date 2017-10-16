import * as types from 'actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
  tabSelect: 'content',
  modelSelect: 0,
  // if user select tab then always reset below values
  query: {
    field: '',
    operator: '',
    value: ''
  },
  isRelativeObject: false,
  realativeModel: '',
  realmResult: null,
};

export default function content(state, action) {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case types.SET_REALM_RESULT:
      return update(state, {
        isRelativeObject: {$set: true},
        realmResult: {$set: action.result},
        realativeModel: {$set: action.model}
      });
    case types.SELECT_TAB_ITEM:
      return update(state, {
        tabSelect: {$set: action.value},
        isRelativeObject: {$set: false},
        realmResult: {$set: null},
        query: {$set: {
          field: '',
          operator: '',
          value: ''
        }}
      });
    case types.SELECT_MODEL:
      return update(state, {
        modelSelect: {$set: action.value},
        realmResult: {$set: null},
        isRelativeObject: {$set: false},
        query: {$set: {
          field: '',
          operator: '',
          value: '',
        }}
      });
    case types.SELECT_FIELD:
      return update(state, {
        query: {field: {$set: action.value}}
      });
    case types.SELECT_OPERATOR:
      return update(state, {
        query: {operator: {$set: action.value}}
      });
    case types.SELECT_QUERY_VALUE:
      return update(state, {
        query: {value: {$set: action.value}}
      });
    default:
      return state;
  }
}