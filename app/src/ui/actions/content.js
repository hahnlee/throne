import {
  SET_REALM_RESULT,
  SELECT_FIELD,
  SELECT_MODEL,
  SELECT_OPERATOR,
  SELECT_TAB_ITEM,
  SELECT_QUERY_VALUE
} from './ActionTypes';

/**
 * Select tab item
 * @param {string} tabName 
 */
export function selectTabitem(tabName) {
  return { type: SELECT_TAB_ITEM, value: tabName.toLowerCase()}
}

/**
 * Select model index
 * @param {number} index 
 */
export function selectModel(index) {
  return { type: SELECT_MODEL, value: index };
}

export function selectField(field) {
  return { type: SELECT_FIELD, value: field };
}

export function selectOperator(operator) {
  return { type: SELECT_OPERATOR, value: operator };
}

export function setQueryValue(query) {
  return { type: SELECT_QUERY_VALUE, value: query };
}

export function setRealmResult(realmResult, model) {
  return { type: SET_REALM_RESULT, model: model, result: realmResult};
}
