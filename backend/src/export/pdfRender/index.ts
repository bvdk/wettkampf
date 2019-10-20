import path from "path";
import PdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

PdfMake.vfs = pdfFonts.pdfMake.vfs;

const fonts = {
  Roboto: {
    normal: path.resolve(
      __dirname,
      "./../../../fonts/Roboto/Roboto-Regular.ttf"
    ),
    bold: path.resolve(__dirname, "./../../../fonts/Roboto/Roboto-Medium.ttf"),
    italics: path.resolve(
      __dirname,
      "./../../../fonts/Roboto/Roboto-Italic.ttf"
    ),
    bolditalics: path.resolve(
      __dirname,
      "./../../../fonts/Roboto/Roboto-MediumItalic.ttf"
    )
  }
};

export default () => new PdfMake(fonts);
