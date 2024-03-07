// This script runs over a Email list in CSV format and cleans the data.
// All double Email addresses are removed and the list is sorted.
// The cleaned list is saved as a new CSV file with a attached timestamp.
// Import required modules
const fs = require("fs");
const csv = require("fast-csv");

// Define the input and output file paths and names
// Edit the filename to match "uncleanEmails" or edit the path below to match your filename.
const inputFile = "./List inbox/uncleanEmails.csv";

const outputDirectory = "./List outbox/"; // Directory where the cleaned CSV file will be saved.
const outputFileName = "cleanEmails"; // Base name for the output file, a timestamp will be appended to ensure uniqueness.

// Initialize a Map to keep track of unique email addresses.
const emailMap = new Map();

// Begin reading input CSV file in a stream to handle large files.
fs.createReadStream(inputFile)
  .pipe(csv.parse({ headers: true, delimiter: ";" })) // Parse the CSV data.
  .on("data", (row) => {
    // For each row of data, extract the 'Email:' and 'Name:' fields.
    const email = row["Email:"];
    const name = row["Name:"];

    // Proceed only if the email field is not empty.
    if (email) {
      // Standardize the email address to prevent duplicates based on case sensitivity or leading/trailing spaces.
      const cleanedEmail = email.toLowerCase().trim();

      // If this email hasn't been encountered before, add it to the map with its associated name.
      if (!emailMap.has(cleanedEmail)) {
        emailMap.set(cleanedEmail, name);
      }
    }
  })
  .on("end", () => {
    // After processing all rows, sort the unique emails alphabetically to prepare for output.
    const uniqueEmails = Array.from(emailMap).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    // Create a timestamp string to append to the output filename, ensuring it's unique and prevents overwrites.
    const now = new Date();
    const timestamp = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}-${now.getFullYear()}`;
    const outputFile = `${outputFileName}_${timestamp}.csv`;

    // Ensure the output directory exists; create it if it doesn't, including any necessary parent directories.
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    // Set up a writable stream to the designated output file for the cleaned CSV data.
    const outputStream = fs.createWriteStream(outputDirectory + outputFile);

    // Convert the sorted unique email list to object format for the CSV file.
    const outputData = uniqueEmails.map(([email, name]) => ({
      Name: name,
      Email: email,
    }));

    // Write the cleaned and formatted data to the new CSV file, including headers.
    csv
      .write(outputData, { headers: true })
      .pipe(outputStream) // Pipe the CSV content to the output stream.
      .on("finish", () => {
        // Once the write operation is complete, log a confirmation message with the output file's name.
        console.log("Email list cleaned and saved to", outputFile);
      });
  });
