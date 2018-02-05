SOURCE = ./src/contracts/PicopsCompliance.sol ./src/contracts/SimpleCertifier.sol ./src/contracts/Certifier.sol ./src/contracts/Owned.sol

./out/contracts/__src_contracts_PicopsCompliance_sol_PicopsCompliance.abi: ./src/contracts/PicopsCompliance.sol
					solcjs --abi --bin $(SOURCE) -o ./out/contracts
