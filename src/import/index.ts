
import * as _ from "lodash";
import * as csv from "csvtojson";
import parseImport from "./parseImport";


const importResolver = (req, res) => {

  const data = _.get(req, "files.file.data");
  if (data) {


    csv({
      noheader: false,
      output: "json",
    })
      .fromString(data.toString())
      .then((json) => {

        const parsed = parseImport(json);
        res.json(parsed);
      });


  } else {
    res.status(500).json({success: false, message: "Please send a POST request with containing a file as FormData"});
  }

}

export default importResolver;
