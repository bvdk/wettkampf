import  _ from "lodash";
import {importAthleteKeyMap, importOfficialsKeyMap} from "./importConfig";

type ImportType = "athlete" | "official";

const parseImportItem = (importObject, keyMap, defaultProps: any = {}) => Object.keys(importObject).reduce((acc, key) => {
    const mapConfig = _.get(keyMap, key.replace(/"/g, ""));
    if (mapConfig) {
        acc[mapConfig.name] = mapConfig.import(importObject[key])
    }
    return acc;
}, {
    ...defaultProps,
});

export default (importList, defaultAthleteProps) => {
    const athletes = [];
    const officials = [];

    let type: ImportType = "athlete";
    _.forEach(importList, (item, index) => {
        if (_.get(item, "Athleten") === "Kampfrichter") {
            type = "official";
            return;
        }
        console.log(item);
        if (type === "athlete") {
            athletes.push(parseImportItem(item, importAthleteKeyMap, defaultAthleteProps));
        } else if (type === "official") {
            officials.push(parseImportItem(item, importOfficialsKeyMap));
        }
    });

    return {
        athletes,
        officials,
    };
};
