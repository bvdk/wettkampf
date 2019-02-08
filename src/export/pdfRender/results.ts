import _ from "lodash";
import EventResolver from "../../graphql/resolvers/Event";
import EventsResolver from "../../graphql/resolvers/Events";



const getEventResultsDoc = (eventId) => {

    const content = [];

    const eventsResolver = new EventsResolver();
    const eventResolver = new EventResolver();
    const event = eventsResolver.event({id: eventId});
    const athletes = eventResolver.athletes(event);
    const groups = _.chain(athletes)
        .groupBy((athlete) => {
            return `${athlete.ageClassId}-${athlete.gender}`;
        })
        .value();

    const tables = Object.keys(groups).map((key)=>{
        const table = {
            layout: 'lightHorizontalLines', // optional
            table: {
                headerRows: 1,
                widths: [ '*', 'auto', 100, '*' ],
                body: [
                    [ 'Name', 'Second', 'Third', 'The last one' ],
                ]
            }
        };

        const group = groups[key];

        return table;

    });

    return {
        content: tables,
        defaultStyle: {
            font: "Roboto",
        },
    };

};

export default getEventResultsDoc;
