const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
chai.should();
const expect = chai.expect;
const dataForge = require('data-forge');
const dataForgeFs = require('data-forge-fs');

const combiner = require('../csv-combiner.js');

describe('CSV-Combiner', function () {

  it('Script uses readFileSync used to Read CSV File', () => {
    let setReadFileSyncSpy = sinon.spy(dataForgeFs, 'readFileSync');

    dataForgeFs.readFileSync('../fixtures/accessories.csv');

    setReadFileSyncSpy.should.have.been.calledOnce;
    expect(setReadFileSyncSpy).to.have.been.calledWith('../fixtures/accessories.csv');

    setReadFileSyncSpy.restore();
  });

  it('Successfully appends filename column and combines CSV files', () => {

  })
});
