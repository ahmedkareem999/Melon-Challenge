pragma solidity ^0.4.19;

import "ds-test/test.sol";

import "./Melonchallenge.sol";

contract MelonchallengeTest is DSTest {
    Melonchallenge melonchallenge;

    function setUp() public {
        melonchallenge = new Melonchallenge();
    }

    function testFail_basic_sanity() public {
        assertTrue(false);
    }

    function test_basic_sanity() public {
        assertTrue(true);
    }
}
