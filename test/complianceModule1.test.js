import test from 'ava';
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const fs = require('fs');
const solc = require('solc');

const provider = ganache.provider();
const web3 = new Web3(provider);

const bytecode = fs.readFileSync('./__contracts_ComplianceInterface_sol_ComplianceInterface.bin');
const compInterface = fs.readFileSync('./__contracts_ComplianceInterface_sol_ComplianceInterface.abi');

const bytecode1 = fs.readFileSync('./__contracts_SimpleCertifier_sol_SimpleCertifier.bin');
const interface1 = fs.readFileSync('./__contracts_SimpleCertifier_sol_SimpleCertifier.abi');


let accounts;
let compliance;
let picopsAddress;
let complianceAddress;
let picops;
let result1;

const deploy = async () => {
    const accounts1 = await web3.eth.getAccounts();
    result1 = await new web3.eth.Contract(JSON.parse(interface1))
    .deploy({data : '0x' + bytecode1})
    .send({from : accounts1[0], gas : '1000000'});

    picopsAddress = result1.options.address;
    //console.log(picopsAddress);


    compliance = await new web3.eth.Contract(JSON.parse(compInterface))
    .deploy({data : '0x' + bytecode, arguments : [picopsAddress]})
    .send({from : accounts1[0], gas : '6000000'});

    complianceAddress = compliance.options.address;
    //console.log(complianceAddress);

    compliance.setProvider(provider);
    result1.setProvider(provider);
  };

  test.beforeEach( async t => {
    await deploy();

  });

  test('deploys a contract', async t => {
    await t.truthy(complianceAddress);
    console.log(complianceAddress);

  });

  test('Checks if subscription is permitted', async t => {
    const accounts = await web3.eth.getAccounts();
    let x1 = await result1.methods.certify(accounts[0]).send({from : accounts[0]});
    let x = await compliance.methods.isSubscriptionPermitted(accounts[0],1000000000000000000,1000000000000000000).call();
    t.is(x,true,'subscription is permitted');

  });

    test('Checks if redemption permitted', async t => {
      const accounts = await web3.eth.getAccounts();
      let y1 = await result1.methods.certify(accounts[0]).send({from : accounts[0]});
      let y = await compliance.methods.isRedemptionPermitted(accounts[0],1000000000000000000,1000000000000000000).call();
      t.is(y,true,'redemption is permitted');

    });
