import * as fs from "fs";
import * as _ from "lodash";
import Base from "lowdb/adapters/Base";

export default class CustomFileAsync extends Base {
  public lastWrite = null;

  private source: any;
  private defaultValue: any;
  private writeDebounce: (data: any) => void;

  constructor(source) {
    super(source);

    this.writeDebounce = _.debounce((data: any) => {
      fs.writeFile(this.source, this.serialize(data), () => true);
    }, 1000);
  }

  public read() {
    // fs.exists is deprecated but not fs.existsSync
    if (fs.existsSync(this.source)) {
      // Read database
      try {
        const data = fs.readFileSync(this.source, "utf-8").trim();
        // Handle blank file
        return data ? this.deserialize(data) : this.defaultValue;
      } catch (e) {
        if (e instanceof SyntaxError) {
          e.message = `Malformed JSON in file: ${this.source}\n${e.message}`;
        }
        throw e;
      }
    } else {
      // Initialize
      fs.writeFileSync(this.source, this.serialize(this.defaultValue));
      return this.defaultValue;
    }
  }

  public write(data) {
    this.writeDebounce(data);
  }

  private deserialize(data) {
    super.deserialize(data);
  }

  private serialize(data) {
    super.serialize(data);
  }
}

module.exports = CustomFileAsync;
