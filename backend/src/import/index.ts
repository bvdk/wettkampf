import csv from "csvtojson";
import _ from "lodash";
import AthleteGroupsResolver from "../graphql/resolvers/AthleteGroups";
import AthletesResolver from "../graphql/resolvers/Athletes";
import OfficialsResolver from "../graphql/resolvers/Officials";
import parseImport from "./parseImport";

const importResolver = (req, res) => {
  const eventId = req.params.eventId;

  const data = _.get(req, "files.file.data");
  if (data && eventId) {
    csv({
      noheader: false,
      output: "json"
    })
      .fromString(data.toString())
      .then(json => {
        const parsed = parseImport(json, {
          raw: _.get(req, "body.raw") === "true"
        });

        const athletesResolver = new AthletesResolver();
        const officialsResolver = new OfficialsResolver();

        const athletes = _.chain(parsed)
          .get("athletes")
          .map((importAthlete: any) => {
            let exisiting = null;
            if (importAthlete.importId) {
              exisiting = athletesResolver.findAthlete({
                eventId,
                importId: importAthlete.importId
              });
            }
            if (exisiting) {
              return athletesResolver.updateAthlete(
                { id: exisiting.id },
                importAthlete,
                null
              );
            } else {
              return athletesResolver.createAthlete(
                { data: importAthlete, eventId },
                null
              );
            }
          })
          .value();

        const officials = _.chain(parsed)
          .get("officials")
          .map((official: any) => {
            let exisiting = null;
            if (official.importId) {
              exisiting = officialsResolver.findOfficial({
                eventId,
                importId: official.importId
              });
            }
            if (exisiting) {
              return officialsResolver.updateOfficial(
                { id: exisiting.id },
                official
              );
            } else {
              return officialsResolver.createOfficial({
                data: official,
                eventId
              });
            }
          })
          .value();

        res.json({
          athletes,
          officials
        });
      });
  } else {
    res.status(500).json({
      success: false,
      message: "Please send a POST request with containing a file as FormData"
    });
  }
};

export default importResolver;
