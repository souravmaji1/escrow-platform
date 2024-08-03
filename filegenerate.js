const fs = require('fs');
const path = require('path');

// Sample data
const data = [
  ['first_name', 'last_name', 'city', 'state'],
  ['Charlotte', 'Brown', 'Austin', 'TX'],
  ['James', 'Wilson', 'Jacksonville', 'FL'],
  ['Amelia', 'Davis', 'San Francisco', 'CA'],
  ['Benjamin', 'Martinez', 'Indianapolis', 'IN'],
  ['Harper', 'Clark', 'Columbus', 'OH'],
  ['Lucas', 'Rodriguez', 'Fort Worth', 'TX'],
  ['Evelyn', 'Lee', 'Charlotte', 'NC'],
  ['Henry', 'Walker', 'Seattle', 'WA'],
  ['Abigail', 'Hall', 'Denver', 'CO'],
  ['Alexander', 'Allen', 'Washington', 'DC']
];


// Function to convert data to CSV format
function convertToCSV(data) {
  return data.map(row => row.join(',')).join('\n');
}

// Generate CSV content
const csvContent = convertToCSV(data);

// Define the output file path
const outputPath = path.join(__dirname, 'sample_data.csv');

// Write to CSV file
fs.writeFile(outputPath, csvContent, (err) => {
  if (err) {
    console.error('Error writing CSV file:', err);
  } else {
    console.log(`CSV file has been created successfully at: ${outputPath}`);
  }
});