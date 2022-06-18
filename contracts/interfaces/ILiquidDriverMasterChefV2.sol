// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// https://ftmscan.com/address/0x5cee2988184afe3cd807e0178b394259e8cdc56c#code

interface ILiquidDriverMasterChefV2 {

    function deposit(uint256 _pid, uint256 _amount, address _to) external;

    function withdraw(uint256 _pid, uint256 _amount, address _to) external;

    function pendingLqdr(uint256 _pid, address _user) external view returns (uint256);

    function userInfo(uint _pid, address _user) external view returns (uint amount, uint rewardDebt);

    function harvest(uint256 _pid, address _to) external;
}
