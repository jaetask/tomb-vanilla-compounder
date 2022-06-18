// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
 
import "./interfaces/ILiquidDriverMasterChefV2.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router02.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; 
  
contract LiquidDriverVanillaYieldExtractor is AccessControl {
    using SafeERC20 for IERC20;   
 
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    // Tokens       
    IERC20 public lqdr;  
    IUniswapV2Pair public spiritLqdrFtmLP;

    // Lqdr's farm contracts and pool identifier for the LP token.
    ILiquidDriverMasterChefV2 public farm;
    uint public poolId; 

    // SpiritSwap's smart contracts
    IUniswapV2Router02 public spiritRouter; 

    constructor(
        address _lqdr,
        address _spiritLqdrFtmLP,
        address _farm,
        uint _poolId,
        address _spookyRouter,
        address _operator
    ) {
        lqdr = IERC20(_lqdr);
        spiritLqdrFtmLP = IUniswapV2Pair(_spiritLqdrFtmLP);
        farm = ILiquidDriverMasterChefV2(_farm);
        poolId = _poolId;
        spiritRouter = IUniswapV2Router02(_spookyRouter);

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, _operator);
    }

    // Fallback payable function
    receive() external payable {}
    
    function getLPBalanceAtFarm() public view returns (uint256) {
        // this should be the total balance of LP staked in the farm by _this_ contract
        (uint256 amount, ) = farm.userInfo(poolId, address(this));
        return amount;
    }

    // Functions to withdraw tokens only from this contract
    function withdrawDustFTM() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(address(this).balance > 0, "No dust FTM to withdraw!");
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawDustLQDR() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(lqdr.balanceOf(address(this)) > 0, "No dust LQDR to withdraw!");
        lqdr.safeTransfer(msg.sender, lqdr.balanceOf(address(this)));
    }

    // this will harvest LQDR from the staked LP in the farm
    function _claimAnyLqdrRewardsFromFarm() internal {
        // calling withdraw with amount as 0 simply claims any pending TSHAREs
        farm.harvest(poolId, address(this));
    }

    function pendingRewardsFromFarm() public view returns (uint256 pending) {
        return _pendingRewardsFromFarm();
    }

    function _pendingRewardsFromFarm() internal view returns (uint256 pending) {
        return farm.pendingLqdr(poolId, address(this));
    }

    // no auto-compounding, we send the LP direct to this contract
    function _depositAnyLPIntoFarm() internal {
        uint256 contractLpBalance = spiritLqdrFtmLP.balanceOf(address(this));
        if (contractLpBalance > 0) {
            spiritLqdrFtmLP.approve(address(farm), contractLpBalance);
            farm.deposit(poolId, contractLpBalance, address(this));
        }
    }
}
