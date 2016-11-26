import Papa from 'papaparse';

export default function previewCSV(file, callback) {
    // Parses a file (tsv/csv) into an object containing subscribers
    // and their fields
    Papa.parse(file, {
        header: true, // First row are headers
        preview: 10, // Show first 10 results
        skipEmptyLines: true,
        complete: function(results) { // Can also take 2nd 'file' parameter
            // Filter results to get rid of empty arrays. This occurs when files with less than 10 (or 11) rows are provided.
            results.data = results.data.filter(i => i.email !== '');
            callback(results);
        }
    });
}
