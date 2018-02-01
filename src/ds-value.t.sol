pragma solidity ^0.4.19;

import "ds-test/test.sol";

import "./ds-value.sol";

contract ds-valueTest is DSTest {
    ds-value melonchallenge;

    function setUp() public {
        melonchallenge = new ds-value();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
