import _ from "lodash";
import {exportAthleteKeyMap, importAthleteKeyMap, importOfficialsKeyMap} from "../import/importConfig";

const exportKeys = [
    "Athleten",
    "Age Category",
    "Gewichtsklasse",
    "Last Name",
    "First Name",
    "ID",
    "Geschlecht",
    "Verein",
    "Geburtstag",
    "Total",
    "Norm",
    "Late Registration",
    "Preis",
    "Body Weight",
    "Wilks",
    "Los",
    "Kniebeuge 1",
    "Kniebeuge 2",
    "Kniebeuge 3",
    "Bankdrücken 1",
    "Bankdrücken 2",
    "Bankdrücken 3",
    "Kreuzheben 1",
    "Kreuzheben 2",
    "Kreuzheben 3",
    "Total Erg",
    "Punkte",
    "Platz",
    "Ort",
];

const officalsKeys = [
    "Kampfrichter", "Last Name", "First Name", "ID", "Verein", "Lizenz", "Position", "Ort",
];

const generateExportItem = (keyMap, exportItem) => exportKeys.reduce((acc, key: string) => {
    const tmp = keyMap[key];

    if (tmp && tmp.export) {
        acc[key] = tmp.export(_.get(exportItem, tmp.name)) || null;
    } else {
        acc[key] = "";
    }

    return acc;
}, {});

const generateOfficialsHeader = (officials: any[]): any[] => {
    if (!officials || !officials.length ) { return []; }

    const tmp = exportKeys.reduce((acc, key: string, index: number) => {

        acc[key] = "";
        if (officalsKeys.length > index) {
            acc[key] = officalsKeys[index];
        }

        return acc;
    }, {});
    console.log(tmp);
    return [tmp];
};

export default (athletes = [], officials = []) => {

    const result = [
        ...athletes.map((item) => generateExportItem(importAthleteKeyMap, item)),
        ...generateOfficialsHeader(officials),
        ...officials.map((item) => generateExportItem(importOfficialsKeyMap, item)),
    ];

    return result;
};
