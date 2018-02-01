import test from 'ava';

const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs');

const provider = ganache.provider();
const web3 = new Web3(provider);

const complianceInterfaceBin = fs.readFileSync('././out/contracts/ComplianceInterface.bin');
const complianceInterfaceAbi = fs.readFileSync('././out/contracts/ComplianceInterface.abi');

const simpleCertifierBin = fs.readFileSync('././out/contracts/SimpleCertifier.bin');
const simpleCertifierAbi = fs.readFileSync('././out/contracts/SimpleCertifier.abi');


let compliance;
let picopsAddress;
let complianceAddress;
let simplecertifer;

const deploy = async () => {
  const accounts1 = await web3.eth.getAccounts();
  simplecertifer = await new web3.eth.Contract(JSON.parse(simpleCertifierAbi))
    .deploy({ data: `0x${simpleCertifierBin}` })
    .send({ from: accounts1[0], gas: '1000000' });
  picopsAddress = simplecertifer.options.address;


  compliance = await new web3.eth.Contract(JSON.parse(complianceInterfaceAbi))
    .deploy({ data: `0x${complianceInterfaceBin}`, arguments: [picopsAddress] })
    .send({ from: accounts1[0], gas: '6000000' });

  complianceAddress = compliance.options.address;


  compliance.setProvider(provider);
  simplecertifer.setProvider(provider);
};

test.beforeEach(async () => {
  await deploy();
});

test('deploys a contract', async (t) => {
  await t.truthy(complianceAddress);
});

test('Checks if subscription is permitted', async (t) => {
  const accounts = await web3.eth.getAccounts();
  await simplecertifer.methods.certify(accounts[0]).send({ from: accounts[0] });
  const subscriptionPermitted = await compliance.methods
    .isSubscriptionPermitted(accounts[0], 1000000000000000000, 1000000000000000000).call();
  t.is(subscriptionPermitted, true, 'subscription is not permitted');
});

test('Checks if redemption permitted', async (t) => {
  const accounts = await web3.eth.getAccounts();
  await simplecertifer.methods.certify(accounts[0]).send({ from: accounts[0] });
  const redemptionPermitted = await compliance.methods
    .isRedemptionPermitted(accounts[0], 1000000000000000000, 1000000000000000000).call();
  t.is(redemptionPermitted, true, 'redemption is not permitted');
});
