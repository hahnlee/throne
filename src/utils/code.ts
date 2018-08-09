import * as vm from 'vm';

import * as Realm from 'realm';


export function excute(realm: Realm, code: string) {
  const sandbox = vm.createContext({ realm, console });
  const result = vm.runInNewContext(code, sandbox) as Realm.Results<any>;
  return result;
}
