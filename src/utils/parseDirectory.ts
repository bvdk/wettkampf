import * as fs from "fs";

function parseDirectory(basename, dir) {
  return fs
    .readdirSync(dir)
    .filter(
      (file) =>
        file.indexOf(".") !== 0 &&
        file !== basename &&
        file.slice(-3) === ".ts",
    );
}

export default parseDirectory;
