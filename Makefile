all    :; dapp build
clean  :; dapp clean
test   :; dapp test
deploy :; dapp create Melonchallenge

match := code
SOURCES := 1-Certifier.solidity 2-ComplianceInterface.solidity 3-Owned.solidity 4-SimpleCertifier.solidity

.PHONY: code bin clean

code: $(SOURCES:.solidity=.code)

bin: $(SOURCES:.solidity=.bin) $(SOURCES:.solidity=.bin+opt)

clean:
	rm -f *.code *.bin *.bin-runtime *.bin+opt *.disasm

disasm: $(SOURCES:.solidity=.disasm)

%.asm: %.solidity
	solc --code $< > $@

%.bin: %.solidity
	solc --bin $< > $@

%.bin+opt: %.solidity
	solc --bin --optimize $< > $@

%.disasm: %.solidity
	solc --bin-runtime -o `pwd` $<
	cat `ls *.bin-runtime` | evmdis > $@
	rm *.bin-runtime
