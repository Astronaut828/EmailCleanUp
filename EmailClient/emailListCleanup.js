// This script runs over a Email list in CSV format and cleans the data.
// All double Email addresses are removed and the list is sorted.
// The cleaned list is saved as a new CSV file with a attached timestamp.
// Import required modules
const fs = require("fs");
const csv = require("fast-csv");

// Define the input and output file paths and names
const inputFile = "./List inbox/uncleanEmails.csv";
const outputDirectory = "./List outbox/";
const outputFileName = "cleanEmails";

// Create a map to store unique email addresses
const emailMap = new Map();

// Read the input file and process it line by line
fs.createReadStream(inputFile)
  .pipe(csv.parse({ headers: true, delimiter: ";" }))
  .on("data", (row) => {
    // Extract email and name from each row
    const email = row["Email:"];
    const name = row["Name:"];

    // Check if email is present in the row
    if (email) {
      // Clean and standardize the email format
      const cleanedEmail = email.toLowerCase().trim();

      // Add the email to the map if it's not already present
      if (!emailMap.has(cleanedEmail)) {
        emailMap.set(cleanedEmail, name);
      }
    }
  })
  .on("end", () => {
    // Sort the unique emails alphabetically
    const uniqueEmails = Array.from(emailMap).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    // Generate a timestamp for the output file
    const now = new Date();
    const timestamp = `${String(now.getMonth()).padStart(2, "0")}-
                       ${String(now.getDate()).padStart(2, "0")}-
                       ${now.getFullYear()}`;
    const outputFile = `${outputFileName}_${timestamp}.csv`;

    // Check if the output directory exists, create it if not
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    // Create a stream to write the cleaned email list to a file
    const outputStream = fs.createWriteStream(outputDirectory + outputFile);

    // Map the unique emails and names to the required format
    const outputData = uniqueEmails.map(([email, name]) => ({
      Name: name,
      Email: email,
    }));

    // Write the output data to a CSV file
    csv
      .write(outputData, { headers: true })
      .pipe(outputStream)
      .on("finish", () => {
        // Log a message when the process is complete
        console.log("Email list cleaned and saved to", outputFile);
      });
  });
