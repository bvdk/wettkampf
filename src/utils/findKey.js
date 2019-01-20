import _ from "lodash";


function findKey(object, key) {

    if (!object){
        return null;
    }


    if (object[key]) {
        return object[key]
    }

    let result = null;


    Object.keys(object).forEach((item) => {
        console.log('hier', item);
        const tmp = object[item];

        if (_.isObject(tmp)) {
            result = findKey(tmp, key);
        }
    });

    return result;

}

export default findKey;
