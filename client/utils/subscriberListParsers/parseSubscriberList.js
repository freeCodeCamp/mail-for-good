import Papa from 'papaparse';

export default function parseSubscriberList(inputData, fields) {
  // Parses a file (tsv/csv) to a format that can be recognised by the multiple subscriber api
  //  {
  //    fields: [ { fieldname1: fieldtype1 }, { fieldname2: fieldtype2... }],
  //    subscribers: {
  //      { fieldname1: fieldname1_record1, fieldname2: fieldname2_record1 },
  //      { fieldname1: fieldname1_record2, fieldname2: fieldname2_record2 },
  //      { fieldname1: fieldname1_record3, fieldname2: fieldname2_record3 },
  //       ...
  //    }
  //  }

  // Convert the fields to a header line that Papa can parse into a
  // value keyed object array, rather than an array of arrays
  let header = [];
  fields.forEach((field) => {
    header.push(field.name)
  });
  header = header.join(',');
  
  const data = Papa.parse(header + '\n' + inputData, { header: true });

  return data.data;
}
