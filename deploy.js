const HDWalletProvider = require('truffle-hdwallet-provider');

const Web3 = require('web3');
const ganache = require('ganache-cli');
const fs = require('fs');
//const web3 = new Web3(ganache.provider());

//const provider = new HDWalletProvider(
//  'abuse chaos fragile liberty garlic much ill hire bottom music valve panda',
//  'https://rinkeby.infura.io/SzGyPVUZljBHJkicqcvd'
//);
let contractAddress;
//const web3 = new Web3(provider);
const web3 = new Web3(ganache.provider());

const bytecode1 = fs.readFileSync('__contracts_SimpleCertifier_sol_SimpleCertifier.bin');
const interface1 = fs.readFileSync('__contracts_SimpleCertifier_sol_SimpleCertifier.abi');

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attempting to deploy from the account ', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface1))
    .deploy({data : bytecode1})
    .send({from : accounts[0],gas : '1000000'});

    console.log('Contract deployed to', result.options.address);
    contractAddress = result.options.address;
    console.log(contractAddress);
  };

  deploy();
