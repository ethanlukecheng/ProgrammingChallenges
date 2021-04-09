#! /usr/local/bin/node

const dataForge = require('data-forge');
const dataForgeFs = require('data-forge-fs');
const path = require('path');

// Slices Names from Console ['./fixtures/accessories.csv', ...]
const fileNames = process.argv.slice(2);

const readCSVFiles = fileNames => {
  const readFiles = [];

  // Use each fileName to Read & Transform Data
  fileNames.forEach(fileName => {

    // Filters filenames to base filenames
    let baseName = path.posix.basename(fileName);

    // Reads a CSV dataframe
    let df = dataForgeFs.readFileSync(fileName).parseCSV();

    // Adds filename column to current CSV dataframe
    let newSeries = df.deflate(row => row.filename).select(value => value = baseName);
    let newDf = df.withSeries({ filename: newSeries });

    // Push CSV dataframe into Array
    readFiles.push(newDf);
  });
  return readFiles;
};

const concatCSVFiles = (fileNameArr, csvReader) => {
  let readFilesArr = csvReader(fileNameArr);

  // Concat all Modified dataframes into one CSV dataframe
  const dataFrameConcat = dataForge.DataFrame.concat(readFilesArr);

  // Write the Concat Dataframe to Filesystem
  dataFrameConcat.asCSV().writeFileSync('combined.csv');
}

concatCSVFiles(fileNames, readCSVFiles);







/* Use if validation is wanted
// Slices Names from Console ['./fixtures/accessories.csv', ...]
const fileNames = process.argv.slice(2);

const readCSVFiles = fileNames => {
  const readFiles = [];

  // Use each fileName to Read & Transform Data
  fileNames.forEach(fileName => {

    // Filters filenames to base filenames
    let baseName = path.posix.basename(fileName);

    // Validate for CSV type (if 2> is used)
    const fileType = fileName.substring(fileName.lastIndexOf("."));
    if (fileType !== '.csv') {
      console.log(`${baseName} is not a CSV file.`)
      process.exit(1);
    };

    // Reads a CSV dataframe
    let df = dataForgeFs.readFileSync(fileName).parseCSV();

    // Adds filename column to current CSV dataframe
    let newSeries = df.deflate(row => row.filename).select(value => value = baseName);
    let newDf = df.withSeries({ filename: newSeries });

    // Push CSV dataframe into Array
    readFiles.push(newDf);
  });
  return readFiles;
};

const concatCSVFiles = (fileNameArr, csvReader) => {
  let readFilesArr = csvReader(fileNameArr);

  // Validate all files read
  if (readFilesArr.length < fileNames.length) {
    console.log('A file was not read properly');
    process.exit(0);
  };

  // Concat all Modified dataframes into one CSV dataframe
  const dataFrameConcat = dataForge.DataFrame.concat(readFilesArr);

  // Write the Concat Dataframe to Filesystem
  dataFrameConcat.asCSV().writeFileSync('combined.csv');
}

concatCSVFiles(fileNames, readCSVFiles); */
