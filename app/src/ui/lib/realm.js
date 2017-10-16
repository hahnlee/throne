const NUMBERNIC_QUERY = [
  '==',
  '!=',
  '>',
  '>=',
  '<',
  '<='
];

const STRING_QUERY = [
  '==',
  'BEGINSWITH',
  'ENDSWITH',
  'CONTAINS'
];

// List of realm object property 
const REALM_OBJECT_PROPERTY = {
  'name': {'type': 'string', 'width': 100},
  'type': {'type': 'string', 'width': 100},
  'objectType': {'type': 'string', 'width': 150},
  'optional': {'type': 'boolean', 'width': 100},
  'default': {'type': 'string', 'width': 150},
  'indexed': {'type': 'boolean', 'width': 100}
};

function isNumbernicType(rawType) {
  switch(rawType) {
    case 'int':
    case 'double':
    case 'float':
      return true;
    default:
      return false;
  }
}

export {
  NUMBERNIC_QUERY,
  STRING_QUERY,
  REALM_OBJECT_PROPERTY,
  isNumbernicType
};