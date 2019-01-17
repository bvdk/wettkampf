import * as _ from "lodash";
import {CrudAdapter} from "../database/CrudAdapter";
import {WeightClass} from "../graphql/models/weightClass";

const toAttemptResult = (value) => {
    if (!value) {
        return null;
    }
    return {
        attempt: !!value,
        valid: value > 0,
        weight: parseFloat(value < 0 ? value * -1 : value),
    };
};

const fromAttemptResult =  (value?) => {
    if (!value) {
        return null;
    }
    if (!value.attempt) {
        return null;
    }
    return value.valid ? value.weight * -1 : value.weight;
};

const toNumber = (value) => parseFloat(value);
const toBool = (value) => {
    if (value === "true") {
        return true;
    }
    if (value === "false") {
        return true;
    }
    return !!parseInt(value);
};

const getRawAthleteKeyMap = () => {

    const weightClasses = CrudAdapter.getAll(WeightClass.collectionKey);

    return {
        "Age Category": "ageClass",
        "Body Weight": {
            name: "bodyWeight",
            import: toNumber,
        },
        "First Name": "firstName",
        "Last Name": "lastName",
        "Kniebeuge 1": {
            name: "KB1",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Kniebeuge 2": {
            name: "KB2",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Kniebeuge 3": {
            name: "KB3",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Kreuzheben 1": {
            name: "KH1",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Kreuzheben 2": {
            name: "KH2",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Kreuzheben 3": {
            name: "KH3",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },

        "Bankdrücken 1": {
            name: "BD1",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Bankdrücken 2": {
            name: "BD2",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Bankdrücken 3": {
            name: "BD3",
            import: toAttemptResult,
            export: fromAttemptResult(),
        },
        "Late Registration": {
            name: "lateRegistration",
            import: toBool,
        },
        "Geburtstag": "birthday",
        "Geschlecht": {
            name: "gender",
            import: (value) => String(value).toUpperCase(),
            export: (value) => String(value).toLowerCase(),
        },
        "Gewichtsklasse": {
            name: "weightClass",
            import: (value) => (_.get(_.find(weightClasses, {name: value}), "id")),
            export: (value) => (_.get(_.find(weightClasses, {id: value}), "name")),
        },
        "ID": "importId",
        "Los": {
            name: "los",
            import: toNumber,
        },
        "Norm": {
            name: "norm",
            import: toBool,
        },
        "Ort": "location",
        "Platz": {
            name: "place",
            import: toNumber,
        },
        "Preis": "price",
        "Punkte": {
            name: "points",
            import: toNumber,
            export: (value) => (`${value}`),
        },
        "Total": {
            name: "total",
            import: toNumber,
            export: (value) => (`${value}`),
        },
        "Verein": "club",
        "Wilks": {
            name: "wilks",
            import: toNumber,
            export: (value) => (`${value}`),
        },
    };
};

const rawOfficialKeyMap = {
    "Age Category": "lastName",
    "First Name": "club",
    "Gewichtsklasse": "firstName",
    "ID": "license",
    "Last Name": "importId",
};

const defaultTranslator = (value) => (value);
const prepareKeyMap = (keyMap) => Object.keys(keyMap).reduce((acc, key) => {
    const item = keyMap[key];
    acc[key] = _.isString(item) ? {
        export: defaultTranslator,
        import: defaultTranslator,
        name: item,
    } : {
        export: defaultTranslator,
        import: defaultTranslator,
        ...item,
    };
    return acc;
}, {});

const swapKeys = (keyMap) => Object.keys(keyMap).reduce((acc, key) => {
    const item = keyMap[key];
    acc[item.name] = {
        ...item,
        name: key,
    };
    return acc;
}, {});

const preparedAthleteKeyMap = prepareKeyMap(getRawAthleteKeyMap());
const preparedOfficialsKeyMap = prepareKeyMap(rawOfficialKeyMap);

export const importAthleteKeyMap = preparedAthleteKeyMap;
export const importOfficialsKeyMap = preparedOfficialsKeyMap;

export const exportAthleteKeyMap = swapKeys(preparedAthleteKeyMap);
export const exportOfficialsKeyMap = swapKeys(preparedOfficialsKeyMap);
