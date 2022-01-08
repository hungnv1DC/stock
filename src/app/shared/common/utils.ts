/* eslint-disable arrow-body-style */
import { throwError } from 'rxjs';

export const ofError = (error?: any) => throwError(error || new Error());


export const checkNullParams = (params) => {
    const keyHasValue = [];
    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {
            if (key && params[key]) {
                keyHasValue.push(key);
            }
        }
    }
    const obj = keyHasValue.map((key, index, arr) => {
        return { [key]: params[key] };
    });
    return obj.reduce((result, item) => {
        const key = Object.keys(item)[0];
        result[key] = item[key].toString().trim();
        return result;
    }, {});
};


