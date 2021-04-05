#! /usr/local/bin/node

const dataForge = require('data-forge');
const dataForgeFs = require('data-forge-fs');
const path = require('path');

// Slices Names from Console ['./fixtures/accessories.csv', ...]
const fileNames = process.argv.slice(2);

const readFiles = [];

// Use each fileName to Read & Transform Data
fileNames.forEach(fileName => {
  // Reads a CSV dataframe
  let df = dataForgeFs.readFileSync(fileName).parseCSV();

  // Filters filenames to base filenames
  let baseName = path.posix.basename(fileName);

  // Adds filename column to current CSV dataframe
  let newSeries = df.deflate(row => row.filename);
  newSeries = newSeries.select(value => value = baseName);
  newDf = df.withSeries({ filename: newSeries });

  // Push CSV dataframe into Array
  readFiles.push(newDf);
});

// Concat all Modified dataframes into one CSV dataframe
const dataFrameConcat = dataForge.DataFrame.concat(readFiles);

// Write the Concat Dataframe to Filesystem
dataFrameConcat.asCSV().writeFileSync('combined.csv');

// Check Heap Used
// const used = process.memoryUsage().heapUsed / 1024 / 1024;
// console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
