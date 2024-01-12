
# Email List Cleaner

This Node.js script processes an email list from a CSV file, removes duplicate email addresses, and outputs a cleaned, sorted list in a new CSV file. The output file is timestamped for easy tracking.

## Features

- Removes duplicate email addresses.
- Sorts email addresses alphabetically.
- Outputs cleaned list with a timestamp.

## Requirements

- Node.js
- `fast-csv` npm package

## Installation

Before running the script, ensure you have Node.js installed. You can install the required `fast-csv` package using npm:

```bash
npm install fast-csv
```

or run :
```
yarn install 
```
or
```
npm install
```

## Usage

1. Place your unclean email CSV file in the `./List inbox/` directory. Ensure the file is named `uncleanEmails.csv`.
2. Run the script:

```bash
node emailListCleanup.js
```

3. The cleaned email list will be saved in the `./List outbox/` directory, named in the format `cleanEmails_MM-DD-YYYY.csv`.

## Input File Format

The input CSV file should have the following column headers:

- `Email:`: Contains the email addresses.
- `Name:`: Contains the names associated with each email.

Each row in the file represents an email-name pair, like so:

```
Email:;Name:
email1@example.com;John Doe
email2@example.com;Jane Smith
...
```

## Output File Format

The cleaned CSV file will have the headers `Name` and `Email`, with each row containing the name and email address. The file will be sorted alphabetically by email address:

```
Name,Email
John Doe,email1@example.com
Jane Smith,email2@example.com
...
```

---

Feel free to contribute or suggest improvements!
