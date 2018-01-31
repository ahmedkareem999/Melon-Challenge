import test from 'ava';

const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs');

const provider = ganache.provider();
const web3 = new Web3(provider);

const bytecode = fs.readFileSync('././out/contracts/ComplianceInterface.bin');
const compInterface = fs.readFileSync('././out/contracts/ComplianceInterface.abi');

const bytecode1 = fs.readFileSync('././out/contracts/SimpleCertifier.bin');
const interface1 = fs.readFileSync('././out/contracts/SimpleCertifier.abi');


let compliance;
let picopsAddress;
let complianceAddress;
let result1;

const deploy = async () => {
  const accounts1 = await web3.eth.getAccounts();
  result1 = await new web3.eth.Contract(JSON.parse(interface1))
    .deploy({ data: `0x${bytecode1}` })
    .send({ from: accounts1[0], gas: '1000000' });
  picopsAddress = result1.options.address;


  compliance = await new web3.eth.Contract(JSON.parse(compInterface))
    .deploy({ data: `0x${bytecode}`, arguments: [picopsAddress] })
    .send({ from: accounts1[0], gas: '6000000' });

  complianceAddress = compliance.options.address;


  compliance.setProvider(provider);
  result1.setProvider(provider);
};

test.beforeEach(async () => {
  await deploy();
});

test('deploys a contract', async (t) => {
  await t.truthy(complianceAddress);
});

test('Checks if subscription is permitted', async (t) => {
  const accounts = await web3.eth.getAccounts();
  await result1.methods.certify(accounts[0]).send({ from: accounts[0] });
  const x = await compliance.methods
    .isSubscriptionPermitted(accounts[0], 1000000000000000000, 1000000000000000000).call();
  t.is(x, true, 'subscription is permitted');
});

test('Checks if redemption permitted', async (t) => {
  const accounts = await web3.eth.getAccounts();
  await result1.methods.certify(accounts[0]).send({ from: accounts[0] });
  const y = await compliance.methods
    .isRedemptionPermitted(accounts[0], 1000000000000000000, 1000000000000000000).call();
  t.is(y, true, 'redemption is permitted');
});
