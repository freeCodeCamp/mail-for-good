import Papa from 'papaparse';

export default function parseSubscriberList(inputData) {
  // Parses a file (tsv/csv) into an object containing subscribers
  // and their fields
  
  const output = Papa.parse(inputData, { header: true });
  const subscribers = output.data;
  const fields = Object.keys(output.data[0]);
  
  return { subscribers, fields };
}
