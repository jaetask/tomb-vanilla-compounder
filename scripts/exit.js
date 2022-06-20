const LqdrAddress = "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9";
const SpiritSwapLqdrFtmPoolId = 0;
const SpiritSwapLqdrFtmLPAddress = "0x4fe6f19031239f105f753d1df8a0d24857d0caa2";
const FarmProxyAddress = "0x6e2ad6527901c9664f016466b8DA1357a004db0f";
// const FarmRealAddress = "0x5CEE2988184afE3CD807e0178B394259E8cdC56C"; This is the MasterChefV2
const SpiritRouterAddress = "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52";
const OperatorAddress = "0x44b4d3Cb8087030A83B07ba2E2803e6D313Cf845";
const DeployedContract = "0x1a0cb0ecd122707d7e3c543af0025371e81f8b24";

const DEV_ADDRESS = process.env.DEV_ADDRESS;
const DEPLOYED_CONTRACT = process.env.DEPLOYED_CONTRACT_V1;

/**
 * COMMAND LINE
 * npx hardhat run scripts/exit.js --network mainnet
 *
 * We are going to remove everything
 * - claim lqdr rewards (lets see if this happens automatically..)
 * - withdraw LP
 *
 */
async function main() {
  const [depositor] = await ethers.getSigners();
  console.log("Using wallet", depositor.address);

  console.log("This doesn't work (access issues?");
  // it gives an 'insufficient funds for intrinsic transaction cost', error
  // but I checked the gas of the transaction and it's ok
  // I did it manually in ftmscan, and it went through with 350 gwei and 650000 gas

  return;

  //------------------------------------------------------
  // now we can deposit the LP into the contract
  const LiquidDriverSoloCrypt = await ethers.getContractFactory("LiquidDriverSoloCrypt");
  const liquidDriverSoloCrypt = await LiquidDriverSoloCrypt.attach(DEPLOYED_CONTRACT);

  //------------------------------------------------------
  // Withdraw the LP tokens from our contract
  const tx = await liquidDriverSoloCrypt.withdrawLP({
    gasLimit: 1000000,
    gasPrice: ethers.utils.parseUnits("2000", "gwei"),
  });
  console.log("Withdrawing LP, awaiting confirmation");
  console.log("tx", tx);
  await tx.wait();
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
