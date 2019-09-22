import fs from "fs";
import path from "path";
import getPdfRenderer from "./pdfRender";
import getEventResultsDoc from "./pdfRender/results";

const exportResultsPdfResolver = (req, res) => {
  const eventId = req.params.eventId;

  const filename = `export_results_${new Date().toISOString()}.pdf`;
  // const filepath = path.join(__dirname, "./tmp/", filename);

  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=${filename}.pdf`
  });

  const pdfDoc = getPdfRenderer().createPdfKitDocument(
    getEventResultsDoc(eventId)
  );
  // pdfDoc.pipe(fs.createWriteStream(filepath));
  pdfDoc.pipe(res);
  pdfDoc.end();
};

export default exportResultsPdfResolver;
