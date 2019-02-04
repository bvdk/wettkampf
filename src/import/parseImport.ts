import  _ from "lodash";
import {importAthleteKeyMap, importOfficialsKeyMap} from "./importConfig";

type ImportType = "athlete" | "official";

const parseImportItem = (importObject, keyMap) => Object.keys(importObject).reduce((acc, key) => {
    const mapConfig = _.get(keyMap, key.replace(/"/g, ""));
    if (mapConfig) {
        acc[mapConfig.name] = mapConfig.import(importObject[key]);
    }
    return acc;
}, {});

export default (importList) => {
    const athletes = [];
    const officials = [];

    let type: ImportType = "athlete";
    _.forEach(importList, (item, index) => {
        if (_.get(item, "Athleten") === "Kampfrichter") {
            type = "official";
            return;
        }

        if (type === "athlete") {
            athletes.push(parseImportItem(item, importAthleteKeyMap));
        } else if (type === "official") {
            officials.push(parseImportItem(item, importOfficialsKeyMap));
        }
    });

    return {
        athletes,
        officials,
    };
};
