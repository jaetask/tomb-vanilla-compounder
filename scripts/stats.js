const LqdrAddress = "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9";
const SpiritSwapLqdrFtmPoolId = 0;
const SpiritSwapLqdrFtmLPAddress = "0x4fe6f19031239f105f753d1df8a0d24857d0caa2";
const FarmProxyAddress = "0x6e2ad6527901c9664f016466b8DA1357a004db0f";
// const FarmRealAddress = "0x5CEE2988184afE3CD807e0178B394259E8cdC56C"; This is the MasterChefV2
const SpiritRouterAddress = "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52";
const OperatorAddress = "0x44b4d3Cb8087030A83B07ba2E2803e6D313Cf845";

const DEV_ADDRESS = process.env.DEV_ADDRESS;
const DEPLOYED_CONTRACT = process.env.DEPLOYED_CONTRACT_V1;

/**
 * COMMAND LINE
 * npx hardhat run scripts/stats.js --network mainnet
 *
 * UNISWAP DOCS
 * https://docs.uniswap.org/protocol/V2/reference/smart-contracts/pair
 */
async function main() {
  const [depositor] = await ethers.getSigners();
  console.log("Using wallet", depositor.address);

  //------------------------------------------------------
  // we need to approve the deployed contract to spend the LP tokens
  const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
  const spiritSwapLP = UniswapV2Pair.attach(SpiritSwapLqdrFtmLPAddress);
  const LiquidDriverSoloCrypt = await ethers.getContractFactory("LiquidDriverSoloCrypt");
  const liquidDriverSoloCrypt = await LiquidDriverSoloCrypt.attach(DEPLOYED_CONTRACT);
  const Erc20 = await ethers.getContractFactory("ERC20");
  const lqdr = Erc20.attach(LqdrAddress);

  // does the crypt have any allowance?
  const preAllowance = await spiritSwapLP.allowance(depositor.address, DEPLOYED_CONTRACT);
  if (preAllowance.gt(0)) {
    console.log("Crypt has allowance of", preAllowance.toString());
  } else {
    console.log("Crypt out of allowance");
  }

  console.log("");
  console.log("LP");

  // how much LP is in the wallet?
  const lpInTheWallet = await spiritSwapLP.balanceOf(depositor.address);
  console.log("- In wallet:", ethers.utils.formatUnits(lpInTheWallet));

  // how much LP is in the crypt?
  const lpInTheCrypt = await spiritSwapLP.balanceOf(DEPLOYED_CONTRACT);
  console.log("- In crypt:", ethers.utils.formatUnits(lpInTheCrypt));

  // how much LP has the contract staked in the farm?
  const lpInTheFarm = await liquidDriverSoloCrypt.getLPBalanceAtFarm();
  console.log("- In farm:", ethers.utils.formatUnits(lpInTheFarm));

  console.log("");
  console.log("LQDR");

  // how much LQDR is in the wallet
  const lqdrInTheWallet = await lqdr.balanceOf(depositor.address);
  console.log("- In wallet", ethers.utils.formatUnits(lqdrInTheWallet));

  // how much LQDR is in the contract
  const lqdrInTheContract = await lqdr.balanceOf(DEPLOYED_CONTRACT);
  console.log("- In contract", ethers.utils.formatUnits(lqdrInTheContract));

  // how many pending LQDR rewards are there?
  const pendingRewardsAtFarm = await liquidDriverSoloCrypt.pendingRewardsFromFarm();
  console.log("- Pending in farm", ethers.utils.formatUnits(pendingRewardsAtFarm));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
