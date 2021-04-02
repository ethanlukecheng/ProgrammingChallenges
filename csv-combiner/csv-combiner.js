#! /usr/local/bin/node

const dataForge = require('data-forge');
const dataForgeFs = require('data-forge-fs');
const path = require('path');

const combiner = () => {
  const fileNames = process.argv.slice(2);

  const readFiles = [];

  fileNames.forEach(fileName => {
    let df = dataForgeFs.readFileSync(fileName).parseCSV();

    let baseName = path.posix.basename(fileName);

    let filenameSeries = new dataForge.Series([baseName]);
    let newDf = df.withSeries('filename', filenameSeries);

    let newSeries = newDf.deflate(row => row.filename);
    newSeries = newSeries.select(value => value = baseName);
    newDf = newDf.withSeries({ filename: newSeries });

    readFiles.push(newDf);
  });

  const dataFrameConcat = dataForge.DataFrame.concat(readFiles);

  dataFrameConcat.asCSV().writeFileSync('combined.csv');
};

combiner();
