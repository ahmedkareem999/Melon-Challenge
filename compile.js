const path = require('path');

const fs = require('fs');

const solc = require('solc');
/*const modulePath = path.resolve(__dirname,'contracts','ComplianceInterface.sol');

const source = fs.readFileSync(modulePath,'utf8');


module.exports = solc.compile(source,1).contracts[':ComplianceInterface'];
*/
const input = fs.readFileSync('./contracts/ComplianceInterface.sol');
const output = solc.compile(input.toString(), 1);
//const interface = JSON.parse(output.contracts['ComplianceInterface'].interface);
//const bytecode = output.contracts['ComplianceInterface'].bytecode;
const bytecode = fs.readFileSync('./__contracts_ComplianceInterface_sol_ComplianceInterface.bin');
console.log(bytecode);
//console.log(solc.compile(source,1));


/*var inputs = {
    'ComplianceInterface.sol': fs.readFileSync(modulePath).toString(),
};

// Assumes imported files are in the same folder/local path
function findImports(contracts) {
    return {
        'contents': fs.readFileSync(contracts).toString()
    }
}

var compiledCode = solc.compile({sources: inputs}, 1, findImports)

fs.writeFile('ComplianceInterface.json', JSON.stringify(compiledCode), function(err) {
    if (err) throw err;
    console.log('Compiled & saved');
});

compiledCode =  JSON.parse(fs.readFileSync('ComplianceInterface.json').toString());

console.log(compiledCode);
*/
