// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;
import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";
contract RelayerContract {
    address public relayer;
    IERC20 public token;
    constructor(address _tokenAddress) {
        relayer = msg.sender;
        token = IERC20(_tokenAddress);
    }
    modifier onlyRelayer() {
        require(relayer == msg.sender, "THIS_IS_NOT_RELAYER");
        _;
    }
    function updateRelayer(address _updateRelayer) external onlyRelayer {
        relayer = _updateRelayer;
    }
    function make_payment(
        address[] memory _addresses,
        uint[] memory _bals
    ) external onlyRelayer {
        for (uint i = 0; i < _bals.length; ) {
            require(
                token.transferFrom(relayer, _addresses[i], _bals[i]),
                "TOKEN_TRANSFER_FAILED"
            );

            // (bool sent, bytes memory data) = _addresses[i].call{
            //     value: _bals[i]
            // }("");
            // require(sent, "FAILED_TO_SEND_ETHER");
            unchecked {
                i++;
            }
        }
    }
}