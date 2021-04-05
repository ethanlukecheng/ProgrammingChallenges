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

    // Reads a CSV dataframe
    let df = dataForgeFs.readFileSync(fileName).parseCSV();

    // Filters filenames to base filenames
    let baseName = path.posix.basename(fileName);

    // Adds filename column to current CSV dataframe
    let newSeries = df.deflate(row => row.filename).select(value => value = baseName);
    let newDf = df.withSeries({ filename: newSeries });

    // Push CSV dataframe into Array
    readFiles.push(newDf);
  });
  return readFiles;
};

const concatCSVFiles = (readCSVArray, csvReader) => {
  // Concat all Modified dataframes into one CSV dataframe
  const dataFrameConcat = dataForge.DataFrame.concat(csvReader(readCSVArray));

  // Write the Concat Dataframe to Filesystem
  dataFrameConcat.asCSV().writeFileSync('combined.csv');
}

concatCSVFiles(fileNames, readCSVFiles);

