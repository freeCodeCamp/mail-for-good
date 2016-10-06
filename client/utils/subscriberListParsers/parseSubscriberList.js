import Papa from 'papaparse';

export default function previewCSV(file, callback) {
    // Parses a file (tsv/csv) into an object containing subscribers
    // and their fields
    Papa.parse(file, {
        header: true, // First row are headers
        preview: 10, // Show first 10 results
        complete: function(results) { // Can also take 2nd 'file' parameter
            callback(results);
        }
    });
}
