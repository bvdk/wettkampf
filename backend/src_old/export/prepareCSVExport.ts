import moment from "moment";
import { Athlete } from "../graphql/models/athlete";
import { Official } from "../graphql/models/official";
import AthleteResolver from "../graphql/resolvers/Athlete";
import {
  importAthleteKeyMap,
  importOfficialsKeyMap
} from "../import/importConfig";

const Types = {
  string: "STRING",
  number: "NUMBER",
  date: "DATE",
  bool: "BOOL"
};

const exportKeys: Array<{ key: string; type: string }> = [
  { key: "Athleten", type: Types.number },
  { key: "Age Category", type: Types.string },
  { key: "Gewichtsklasse", type: Types.number },
  { key: "Last Name", type: Types.string },
  { key: "First Name", type: Types.string },
  { key: "ID", type: Types.number },
  { key: "Geschlecht", type: Types.string },
  { key: "Verein", type: Types.string },
  { key: "Geburtstag", type: Types.date },
  { key: "Total", type: Types.number },
  { key: "Norm", type: Types.bool },
  { key: "Late Registration", type: Types.bool },
  { key: "Preis", type: Types.number },
  { key: "Body Weight", type: Types.number },
  { key: "Wilks", type: Types.number },
  { key: "Los", type: Types.number },
  { key: "Kniebeuge 1", type: Types.number },
  { key: "Kniebeuge 2", type: Types.number },
  { key: "Kniebeuge 3", type: Types.number },
  { key: "Bankdrücken 1", type: Types.number },
  { key: "Bankdrücken 2", type: Types.number },
  { key: "Bankdrücken 3", type: Types.number },
  { key: "Kreuzheben 1", type: Types.number },
  { key: "Kreuzheben 2", type: Types.number },
  { key: "Kreuzheben 3", type: Types.number },
  { key: "Total Erg", type: Types.number },
  { key: "Punkte", type: Types.number },
  { key: "Platz", type: Types.number },
  { key: "Ort", type: Types.string }
];

const officalsKeys = [
  "Kampfrichter",
  "Last Name",
  "First Name",
  "ID",
  "Verein",
  "Lizenz",
  "Position",
  "Ort"
];

const generateExportItem = (keyMap, exportItem) =>
  exportKeys.reduce((acc, val) => {
    const tmp = keyMap[val.key];

    let value = "";
    if (tmp) {
      switch (val.type) {
        case Types.string: {
          value = tmp.export(exportItem[tmp.name]) || "";
          break;
        }
        case Types.number: {
          value =
            val.key.indexOf("Kniebeuge ") > -1 ||
            val.key.indexOf("Bankdrücken ") > -1 ||
            val.key.indexOf("Kreuzheben ") > -1
              ? tmp.export(exportItem.attempts) || 0
              : exportItem[tmp.name] || 0;
          break;
        }
        case Types.date: {
          if (exportItem[tmp.name]) {
            const date = moment(exportItem[tmp.name]);
            value = date.format("DD.MM.YYYY");
          }
          break;
        }
        case Types.bool: {
          value = tmp.export(exportItem[tmp.name]);
          break;
        }
        default: {
          break;
        }
      }
    }

    acc[val.key] = value;

    return acc;
  }, {});

const generateOfficialsHeader = (officials: any[]): any[] => {
  if (!officials || !officials.length) {
    return [];
  }

  const tmp = exportKeys.reduce((acc, val, index: number) => {
    acc[val.key] = "";
    if (officalsKeys.length > index) {
      acc[val.key] = officalsKeys[index];
    }

    return acc;
  }, {});
  return [tmp];
};

export default (athletes: Athlete[] = [], officials: Official[] = []) => {
  const athleteResolver = new AthleteResolver();

  return [
    ...athletes
      .filter((athlete: Athlete) => athlete.bodyWeight)
      .map(athlete => ({
        ...athlete,
        points: athleteResolver.points(athlete),
        wilks: athleteResolver.wilks(athlete),
        attempts: athleteResolver.attempts(athlete)
      }))
      .map(athlete => generateExportItem(importAthleteKeyMap, athlete)),
    ...generateOfficialsHeader(officials),
    ...officials
      .filter(official => official.position)
      .map(official => generateExportItem(importOfficialsKeyMap, official))
  ];
};
