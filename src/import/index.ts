
import csv from "csvtojson";
import _ from "lodash";
import AthletesResolver from "../graphql/resolvers/Athletes";
import parseImport from "./parseImport";


const importResolver = (req, res) => {

  const eventId = req.params.eventId;
  const data = _.get(req, "files.file.data");
  if (data && eventId) {


    csv({
      noheader: false,
      output: "json",
    })
      .fromString(data.toString())
      .then((json) => {
        const parsed = parseImport(json);

        const athletesResolver = new AthletesResolver();

        const athletes = _.chain(parsed)
            .get("athletes")
            .map((importAthlete: any) => {
              let exisiting = null;
              if (importAthlete.importId) {
                exisiting = athletesResolver.findAthlete({importId: importAthlete.importId});
              }
              if (exisiting) {
                return athletesResolver.updateAthlete({id: exisiting.id}, importAthlete, null);
              } else {
                return athletesResolver.createAthlete({data: importAthlete, eventId}, null);
              }

            })
            .value();

        res.json({
          athletes,
        });
      });


  } else {
    res.status(500).json({success: false, message: "Please send a POST request with containing a file as FormData"});
  }

};

export default importResolver;
