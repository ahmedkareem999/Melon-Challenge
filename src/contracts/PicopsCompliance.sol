pragma solidity ^0.4.19;

import "./SimpleCertifier.sol";

/// @title PicopsCompliance contract
/// @notice This is to be considered as the underlying interface on how to access the compliance contract
contract PicopsCompliance is SimpleCertifier {

    SimpleCertifier public simpleCertifier;
    function PicopsCompliance(address picopsAddress) public {
        simpleCertifier = SimpleCertifier(picopsAddress);
    }

    /// @notice Checks whether subscription is permitted for a participant
    /// @param ofParticipant Address requesting to invest in a Melon fund
    /// @param giveQuantity Quantity of Melon token times 10 ** 18 offered to receive shareQuantity
    /// @param shareQuantity Quantity of shares times 10 ** 18 requested to be received
    /// @return Whether identity is eligible to invest in a Melon fund.

    function isSubscriptionPermitted(address ofParticipant,
        uint256 giveQuantity,
        uint256 shareQuantity)
      public view returns (bool) {
        return simpleCertifier.certified(ofParticipant);

    }

    /// @notice Checks whether redemption is permitted for a participant
    /// @param ofParticipant Address requesting to redeem from a Melon fund
    /// @param shareQuantity Quantity of shares times 10 ** 18 offered to redeem
    /// @param receiveQuantity Quantity of Melon token times 10 ** 18 requested to receive for shareQuantity
    /// @return Whether identity is eligible to redeem from a Melon fund.
    function isRedemptionPermitted(
        address ofParticipant,
        uint256 shareQuantity,
        uint256 receiveQuantity)
      public view returns (bool) {
        return simpleCertifier.certified(ofParticipant);

    }
}
