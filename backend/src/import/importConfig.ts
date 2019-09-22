import _ from "lodash";
import moment from "moment";
import { CrudAdapter } from "../database/CrudAdapter";
import { Discipline } from "../graphql/models/discipline";
import { WeightClass } from "../graphql/models/weightClass";

const toAttemptResult = value => {
  if (!value) {
    return null;
  }
  return {
    done: !!value,
    valid: value > 0,
    weight: parseFloat(value < 0 ? value * -1 : value)
  };
};

const fromAttemptResult = (discipline: Discipline, i: number) => {
  return value => {
    const attempts = value || [];
    const attempt = _.chain(attempts)
      .filter({ discipline })
      .get(`[${i}]`)
      .value();

    if (!attempt) {
      return "";
    }

    return `${attempt.valid && attempt.done ? "" : "-"}${attempt.weight}`;
  };
};

const toNumber = value => parseFloat(value);
const toBool = value => {
  if (value === "true" || value === "Ja") {
    return true;
  }
  if (value === "false" || value === "Nein") {
    return true;
  }
  return !!parseInt(value);
};

const getRawAthleteKeyMap = () => {
  const weightClasses = CrudAdapter.getAll(WeightClass.collectionKey);

  return {
    Athleten: "athleteNumber",
    "Age Category": "ageClassId",
    "Body Weight": {
      name: "bodyWeight",
      import: toNumber
    },
    Vorname: "firstName",
    Nachname: "lastName",
    "First Name": "firstName",
    "Last Name": "lastName",
    "Kniebeuge 1": {
      name: "KB1",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.SQUAT, 0)
    },
    "Kniebeuge 2": {
      name: "KB2",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.SQUAT, 1)
    },
    "Kniebeuge 3": {
      name: "KB3",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.SQUAT, 2)
    },
    "Kreuzheben 1": {
      name: "KH1",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.DEADLIFT, 0)
    },
    "Kreuzheben 2": {
      name: "KH2",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.DEADLIFT, 1)
    },
    "Kreuzheben 3": {
      name: "KH3",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.DEADLIFT, 2)
    },

    "Bankdrücken 1": {
      name: "BD1",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.BENCHPRESS, 0)
    },
    "Bankdrücken 2": {
      name: "BD2",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.BENCHPRESS, 1)
    },
    "Bankdrücken 3": {
      name: "BD3",
      import: toAttemptResult,
      export: fromAttemptResult(Discipline.BENCHPRESS, 2)
    },
    "Late Registration": {
      name: "lateRegistration",
      import: toBool
    },
    Geburtstag: {
      name: "birthday",
      import: value => {
        const date = moment(value, "DD.MM.YYYY");
        if (date.isValid()) {
          return date.toISOString();
        }
        return null;
      },
      export: value => (value ? value.toString() : null)
    },
    Geschlecht: {
      name: "gender",
      import: value => String(value).toUpperCase(),
      export: value => String(value).toLowerCase()
    },
    Gewichtsklasse: "weightClassId",
    ID: "importId",
    Los: {
      name: "los",
      import: toNumber
    },
    Norm: {
      name: "norm",
      import: toBool
    },
    Ort: "location",
    Platz: {
      name: "place",
      import: toNumber
    },
    Preis: "price",
    Punkte: {
      name: "points",
      import: toNumber,
      export: value => `${value}`
    },
    Total: {
      name: "total",
      import: toNumber,
      export: value => `${value}`
    },
    "Total Erg": {
      name: "total",
      import: toNumber,
      export: value => `${value}`
    },
    Verein: "club",
    Wilks: {
      name: "wilks",
      import: toNumber,
      export: value => `${value}`
    }
  };
};

const rawOfficialKeyMap = {
  Athleten: "officalNumber",
  "Age Category": "lastName",
  "First Name": "club",
  Geschlecht: "position",
  Gewichtsklasse: "firstName",
  ID: "license",
  "Last Name": "importId",
  Verein: "location"
};

const defaultTranslator = value => value;
const prepareKeyMap = keyMap =>
  Object.keys(keyMap).reduce((acc, key) => {
    const item = keyMap[key];
    acc[key] = _.isString(item)
      ? {
          export: defaultTranslator,
          import: defaultTranslator,
          name: item
        }
      : {
          export: defaultTranslator,
          import: defaultTranslator,
          ...item
        };
    return acc;
  }, {});

const swapKeys = keyMap =>
  Object.keys(keyMap).reduce((acc, key) => {
    const item = keyMap[key];
    acc[item.name] = {
      ...item,
      name: key
    };
    return acc;
  }, {});

const preparedAthleteKeyMap = prepareKeyMap(getRawAthleteKeyMap());
const preparedOfficialsKeyMap = prepareKeyMap(rawOfficialKeyMap);

export const importAthleteKeyMap = preparedAthleteKeyMap;
export const importOfficialsKeyMap = preparedOfficialsKeyMap;

export const exportAthleteKeyMap = swapKeys(preparedAthleteKeyMap);
export const exportOfficialsKeyMap = swapKeys(preparedOfficialsKeyMap);
