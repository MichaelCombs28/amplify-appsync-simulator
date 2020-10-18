import { JavaMap } from '../value-mapper/map';
import { map as mapper } from '../value-mapper/mapper';
import { JavaArray } from '../value-mapper/array';
export const mapUtils = {
  copyAndRetainAllKeys(map: JavaMap, keys: JavaArray): JavaMap {
    /*
     * Since amplify-velocity-template seems to not be coercing
     * inline lists into JavaArrays, such as $util.copyAndRemoveAllKeys($someMap, ["one", "two", "three"])
     * this is causing a lot of test cases to fail for code that would otherwise work on prod.
     *
     * TODO Remove
     */
    const keysStr = keys instanceof JavaArray ? keys.toJSON() : keys;
    /*
     * /TODO Remove
     */

    return mapper(
      map
        .keySet()
        .toJSON()
        .reduce((sum, [key, val]) => {
          if (keysStr.indexOf(key.toString()) === -1) return sum;
          const valJSON = val && val.toJSON ? val.toJSON() : val;
          return {
            ...sum,
            [key]: valJSON,
          };
        }, {}),
    );
  },

  copyAndRemoveAllKeys(map: JavaMap, keys: JavaArray): JavaMap {
    /*
     * Since amplify-velocity-template seems to not be coercing
     * inline lists into JavaArrays, such as $util.copyAndRemoveAllKeys($someMap, ["one", "two", "three"])
     * this is causing a lot of test cases to fail for code that would otherwise work on prod.
     *
     * TODO Remove
     */
    const keysStr = keys instanceof JavaArray ? keys.toJSON() : keys;
    /*
     * /TODO Remove
     */

    const result = map
      .keySet()
      .toJSON()
      .reduce((acc, key) => {
        key = key && key.toString && key.toString();
        if (!keysStr.includes(key)) {
          const val = map.get(key);
          const valJSON = val && val.toJSON ? val.toJSON() : val;
          return { ...acc, [key]: valJSON };
        }
        return acc;
      }, {});
    return mapper(result);
  },
};
