import _ from "lodash";
import moment from "moment";
import {Athlete} from "../../graphql/models/athlete";
import {getDescriptionForGender} from "../../graphql/models/gender";
import {WeightClass} from "../../graphql/models/weightClass";
import AgeClassesResolver from "../../graphql/resolvers/AgeClasses";
import AthleteResolver from "../../graphql/resolvers/Athlete";
import EventResolver from "../../graphql/resolvers/Event";
import EventsResolver from "../../graphql/resolvers/Events";
import WeightClassResolver from "../../graphql/resolvers/WeightClass";
import WeightClassesResolver from "../../graphql/resolvers/WeightClasses";
import {Discipline, ShortDisciplines} from "./../../graphql/models/discipline";
import {Slot} from "../../graphql/models/slot";
import SlotResolver from "../../graphql/resolvers/Slot";

const attemptCount = 3;

const renderOfficialsTable = (event) => {

    const eventResolver = new EventResolver();

    const officials = eventResolver.officials(event);
    const columns = getOfficialColumns();
    const slots = eventResolver.slots(event);
    const slotResolver = new SlotResolver();


    const table = {
        table: {
            body: [
                columns.map((col) => _.get(col, "title")),
                ..._.chain(officials)
                    .map((item) => {

                        return {
                            ...item,
                            slotText: slots.filter((slot: Slot ) => {
                                const officialSlots = slotResolver.officialSlots(slot);
                                return _.find(officialSlots,{officialId: item.id});
                            } ).map( slot => slot.name).join(", "),
                        };
                    })
                    .map((official) => {
                        return columns.map((col) => {
                            const text = _.get(official, col.dataIndex, "");
                            if (typeof col.render === "function") {
                                return col.render(text, official);
                            }
                            return text;
                        });
                    })
                    .value(),
            ],
            headerRows: 1,
            widths: columns.map((col) => _.get(col, "width", "auto")),
        },
    };

    return table;

}

const getOfficialColumns = () => {
    return [{
        dataIndex: "name",
        render: (text, record) => `${record.lastName}, ${record.firstName}`,
        title: "Name",
        width: 200,
    }, {
        dataIndex: "license",
        render: (text, record) => record.license,
        title: "Lizenz",
        width: 185,
    }, {
        dataIndex: "slotText",
        title: "Bühne",
        width: 390,
    }];
};

const getDisciplineColumns = (availableDisciplines: Discipline[], discipline?: Discipline) => {
    return availableDisciplines.reduce((acc, key) => {
        const dataIndex = `${ShortDisciplines[key]}`;

        if (!discipline || key === discipline) {
            for (let i = 0; i < attemptCount; i++) {
                const iDataIndex = `${dataIndex}${i + 1}`;

                acc.push({
                    dataIndex: iDataIndex,
                    render: (text, record) => {
                        const attempt = _.chain(record)
                            .get("attempts")
                            .filter({discipline: key})
                            .get(`[${i}]`)
                            .value();

                        if (attempt && attempt.done) {
                            return {
                                color: attempt.valid ? "green" : "red",
                                text: `${!attempt.valid ? "-" : "" }${attempt.weight}`,
                            };
                        }
                        return `-`;

                    },
                    title: iDataIndex,
                    width: 25,
                });
            }
        }

        acc.push({
            dataIndex,
            render: (text, record) => {
                const attempt = _.chain(record)
                    .get("bestAttempts")
                    .filter({discipline: key})
                    .first()
                    .value();

                if (attempt && attempt.done) {
                    return {
                        color: attempt.valid ? "green" : "red",
                        text: `${!attempt.valid ? "-" : "" }${attempt.weight}`,
                    };
                }
                return `-`;
            },
            title: dataIndex,
            width: 25,
        });

        return acc;
    }, []);
};


const getColumns = (availableDisciplines) => {
    return [{
        dataIndex: "place",
        title: "Pl",
        width: 15,
    }, {
        dataIndex: "name",
        render: (text, record) => `${record.lastName}, ${record.firstName}`,
        title: "Name",
        width: 80,
    }, {
        dataIndex: "club",
        title: "Verein",
        width: 80,
    }, {
        dataIndex: "Geb/KG/Los",
        render: (text, record) => {

            const birthday = moment(record.birthday);
            return `${birthday.isValid() ? birthday.format("Y") : "-"}/${record.bodyWeight ? record.bodyWeight : "-" }/${record.los ? record.los : "-" }`;
        },
        title: "Geb/KG/Los",
        width: 65,
    },
        ...getDisciplineColumns(availableDisciplines),
        {
            dataIndex: "total",
            title: "Total",
            width: 30,
        }, {
            dataIndex: "wilks",
            title: "Wilks",
            width: 30,
        }, {
            dataIndex: "points",
            title: "Punkte",
            width: 30,
        }];
};

const getEventResultsDoc = (eventId) => {

    const eventsResolver = new EventsResolver();
    const eventResolver = new EventResolver();
    const weightClassesResolver = new WeightClassesResolver();
    const ageClassResolver = new AgeClassesResolver();
    const athleteResolver = new AthleteResolver();
    const event = eventsResolver.event({id: eventId});
    const athletes = eventResolver.athletes(event);
    const groups = _.chain(athletes)
        .filter((athlete: Athlete) => athlete.bodyWeight)
        .groupBy((athlete) => {
            const ageClass = ageClassResolver.ageClass({id: athlete.ageClassId});
            return `${_.get(ageClass, "name")} ${getDescriptionForGender(athlete.gender)}`;
        })
        .value();

    const columns = getColumns(eventResolver.availableDisciplines(event));

    const tables = _.chain(Object.keys(groups))
        .filter(key => _.size(groups, key) > 0)
        .sortBy((key) => {
            const athlete = _.first(_.get(groups, key));
            const ageClassId = _.get(athlete, "ageClassId");
            if (ageClassId) {
                const sortId = _.get(ageClassResolver.ageClass({id: ageClassId}), "sortId");
                return sortId;
            }
            return 0;
        })
        .map((key) => {

        const header = {
            text: key,
            fontSize: 16,
            marginTop: 8,
            bold: true,
            alignment: "center",
        };

        const weightClassGroups = _.chain(groups)
            .get(key, [])
            .groupBy((athlete) => athlete.weightClassId)
            .value();

        const weightClassTables = _.chain(Object.keys(weightClassGroups))
            .map((weightClassId) => weightClassesResolver.weightClass({id: weightClassId}) )
            .orderBy(["min"], ["asc"])
            .map((weightClass: WeightClass) => {

            const weightClassRow = {
                text: _.get(weightClass, "name"),
                fontSize: 14,
                marginBottom: 4,
                marginTop: 8,
            };
            const table = {
                table: {
                    body: [
                        columns.map((col) => _.get(col, "title")),
                        ..._.chain(weightClassGroups)
                            .get(weightClass.id)
                            .map((athlete) => ({
                                ...athlete,
                                attempts: athleteResolver.attempts(athlete),
                                bestAttempts: athleteResolver.bestAttempts(athlete),
                                points: athleteResolver.points(athlete) || 0,
                                total: athleteResolver.total(athlete) || 0,
                                wilks: athleteResolver.wilks(athlete) || 0,
                            }))
                            .orderBy(["points", "total"], ["desc", "desc"])
                            .map((athlete, index) => ({
                                ...athlete,
                                place: index + 1,
                            }))
                            .map((athlete) => {
                                return columns.map((col) => {
                                    const text = _.get(athlete, col.dataIndex, "");
                                    if (typeof col.render === "function") {
                                        return col.render(text, athlete);
                                    }
                                    return text;
                                });
                            })
                            .value(),
                    ],
                    headerRows: 1,
                    widths: columns.map((col) => _.get(col, "width", "auto")),
                },
            };

            return [weightClassRow, table];
        }).value();

        return [header, ..._.flatten(weightClassTables)];

    }).value();

    const officialsTable = renderOfficialsTable(event);

    return {
        content: [
            ..._.flatten(tables),
            {
                text: "Kampfrichter",
                fontSize: 16,
                marginTop: 16,
                marginBottom: 8,
                bold: true,
                alignment: "center",
            },
            officialsTable,
        ],
        defaultStyle: {
            font: "Roboto",
            fontSize: 9,
        },
        pageMargins: [10, 30, 10, 30],
        pageOrientation: "landscape",
    };

};

export default getEventResultsDoc;
