import test from 'ava';

const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs');

const provider = ganache.provider();
const web3 = new Web3(provider);

const picopsComplianceBin = fs.readFileSync('././out/contracts/__src_contracts_PicopsCompliance_sol_PicopsCompliance.bin');
const picopsComplianceAbi = fs.readFileSync('././out/contracts/__src_contracts_PicopsCompliance_sol_PicopsCompliance.abi');

const simpleCertifierBin = fs.readFileSync('././out/contracts/__src_contracts_SimpleCertifier_sol_SimpleCertifier.bin');
const simpleCertifierAbi = fs.readFileSync('././out/contracts/__src_contracts_SimpleCertifier_sol_SimpleCertifier.abi');


let compliance;
let picopsAddress;
let complianceAddress;
let simpleCertifier;

// Deploying contracts
const deploy = async () => {
  const accounts1 = await web3.eth.getAccounts();
  simpleCertifier = await new web3.eth.Contract(JSON.parse(simpleCertifierAbi))
    .deploy({ data: `0x${simpleCertifierBin}` })
    .send({ from: accounts1[0], gas: '1000000' });
  picopsAddress = simpleCertifier.options.address;


  compliance = await new web3.eth.Contract(JSON.parse(picopsComplianceAbi))
    .deploy({ data: `0x${picopsComplianceBin}`, arguments: [picopsAddress] })
    .send({ from: accounts1[0], gas: '6000000' });

  complianceAddress = compliance.options.address;


  compliance.setProvider(provider);
  simpleCertifier.setProvider(provider);
};

// Need to run before each test
test.beforeEach(async () => {
  await deploy();
});


test('deploys a contract', async (t) => {
  await t.truthy(complianceAddress);
});

test('Checks if subscription is permitted', async (t) => {
  const accounts = await web3.eth.getAccounts();
  await simpleCertifier.methods.certify(accounts[0]).send({ from: accounts[0] });
  const subscriptionPermitted = await compliance.methods
    .isSubscriptionPermitted(accounts[0], 1000000000000000000, 1000000000000000000).call();
  t.is(subscriptionPermitted, true);
});

test('Checks if redemption permitted', async (t) => {
  const accounts = await web3.eth.getAccounts();
  await simpleCertifier.methods.certify(accounts[0]).send({ from: accounts[0] });
  const redemptionPermitted = await compliance.methods
    .isRedemptionPermitted(accounts[0], 1000000000000000000, 1000000000000000000).call();
  t.is(redemptionPermitted, true);
});
