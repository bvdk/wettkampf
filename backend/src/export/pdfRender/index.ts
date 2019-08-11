import fs from "fs";
import path from "path";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


const fonts = {
    Roboto: {
        normal: path.resolve(__dirname, "./../../fonts/Roboto/Roboto-Regular.ttf"),
        bold: path.resolve(__dirname, "./../../fonts/Roboto/Roboto-Medium.ttf"),
        italics: path.resolve(__dirname, "./../../fonts/Roboto/Roboto-Italic.ttf"),
        bolditalics: path.resolve(__dirname, "./../../fonts/Roboto/Roboto-MediumItalic.ttf"),
    },
};



const getPdfRenderer = () => {
    const printer = new pdfMake(fonts);

    return printer;
};

export default getPdfRenderer;
