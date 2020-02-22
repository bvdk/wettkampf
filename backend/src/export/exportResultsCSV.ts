import { Response } from "express";
import { Parser } from "json2csv";
import EventResolver from "../graphql/resolvers/Event";
import EventsResolver from "../graphql/resolvers/Events";
import prepareCSVExport from "./prepareCSVExport";

const exportResultsPdfResolver = (req: any, res: Response) => {
  const eventId = req.params.eventId;

  const eventsResolver = new EventsResolver();
  const event = eventsResolver.event({ id: eventId });

  const eventResolver = new EventResolver();
  const athletes = eventResolver.athletes(event);
  const officials = eventResolver.officials(event);

  const exportData = prepareCSVExport(athletes, officials);

  const parser = new Parser();
  const csv = parser.parse(exportData);

  res.setHeader(
    "Content-disposition",
    `attachment; filename=export_${new Date().toISOString()}.csv`
  );
  res.setHeader("Content-type", "text/csv");
  res.write(csv, err => {
    res.end();
  });
};

export default exportResultsPdfResolver;
