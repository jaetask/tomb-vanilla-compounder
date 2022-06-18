// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./LiquidDriverVanillaYieldExtractor.sol";
 
contract LiquidDriverSoloCrypt is LiquidDriverVanillaYieldExtractor {
    using SafeERC20 for IERC20;  
  
    constructor( 
        address _lqdr,
        address _spiritLqdrFtmLP,
        address _farm,
        uint _poolId,
        address _spiritRouter,
        address _operator
    ) LiquidDriverVanillaYieldExtractor(
        _lqdr,
        _spiritLqdrFtmLP,
        _farm,
        _poolId,
        _spiritRouter,
        _operator
    ) { }
 
    // Deposit LPs into this contract, which then get deposited into the Liquid Driver farm
    // The caller must have approved this contract to spend the LPs beforehand
    function depositLP(uint256 _amount) external {
        require(spiritLqdrFtmLP.allowance(msg.sender, address(this)) >= _amount, "Insufficient LP allowance!");
        spiritLqdrFtmLP.transferFrom(msg.sender, address(this), _amount);
        spiritLqdrFtmLP.approve(address(farm), _amount);
        farm.deposit(0, _amount, address(this));
    }

    function withdrawLP() external onlyRole(DEFAULT_ADMIN_ROLE) {
        farm.withdraw(0, getLPBalanceAtFarm(), address(this));
        spiritLqdrFtmLP.transfer(msg.sender, spiritLqdrFtmLP.balanceOf(address(this)));
    }

    // Run the vanilla Liquid driver routine
    function runRoutine() external onlyRole(OPERATOR_ROLE) {
        _claimAnyLqdrRewardsFromFarm();
    }
}
