import fs from "fs";
import { format } from "@fast-csv/format";
import moment from "moment-timezone";


export const csvCreator = async (req, res, data) => {
  const filePath = './data.csv';
  const writeStream = fs.createWriteStream(filePath);
  const csvStream = format({ headers: true });
  csvStream.pipe(writeStream).on('end', () => process.exit());

  await data.forEach((row) => {
    csvStream.write(row);
  });

  csvStream.end();
  writeStream.on('finish', () => {
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
      }
      fs.unlinkSync(filePath);
    });
  });
};


export const customDate = async(date) => {
  const newDate =await moment(date).tz('Asia/Kolkata');
  return newDate;
}