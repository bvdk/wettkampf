import fs from "fs";
import path from "path";
import getEventResultsDoc from "./pdfRender/results";
import getPdfRenderer from "./pdfRender";

const exportResultsPdfResolver = (req, res) => {

    const eventId = req.params.eventId;

    const filename = `export_results_${new Date().toISOString()}.pdf`;
    const filepath = path.join(__dirname, "./tmp/", filename);

    const pdfDoc = getPdfRenderer().createPdfKitDocument(getEventResultsDoc(eventId));
    //pdfDoc.pipe(fs.createWriteStream(filepath));
    pdfDoc.pipe(res);
    pdfDoc.end();


};

export default exportResultsPdfResolver;
