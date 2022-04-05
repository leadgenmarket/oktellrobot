const csvParser = require("csv-parser");
const csvWriter = require("csv-writer");
const fs = require("fs");

module.exports = exports = {
  async load(filePath:any, csvParams:any) {
    const data = [];
    for await (const csv_row of fs
      .createReadStream(filePath)
      .pipe(csvParser(csvParams))) {
      data.push(csv_row);
    }
    return data;
  },

  createWriter(filePath:any, headers:any) {
    return csvWriter.createObjectCsvWriter({
      alwaysQuote: true,
      path: filePath,
      header: headers,
    });
  },
};
