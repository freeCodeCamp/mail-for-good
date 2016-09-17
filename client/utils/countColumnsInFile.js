export default function countColumnsInFile(file) {
  const delimiter = ',';
  
  let firstLine = file.split('\n')[0];
  
  // Only works with comma delim files. Should generalise this out or use some sort of
  // delim detection
  const columns = firstLine.split(delimiter);
  
  return columns.length;
}
