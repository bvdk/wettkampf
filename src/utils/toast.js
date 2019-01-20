// @flow

import {message} from "antd";
import _ from 'lodash'
import Strings from "../constants/strings";
import findKey from "./findKey";

export const toastError = (error) => {
    const text = _.get(error, 'message', error || Strings.errorOccurred);
    message.error(text);
}

export const toastMessage = (string: String | any) => {

    let text = _.isString(string) ? string : findKey(string, 'message');
    if (!_.isString(text)){
        text = String(text);
    }
    message.success(text);

}


