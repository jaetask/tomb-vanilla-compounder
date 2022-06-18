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
 * DEPLOYMENT
 * npx hardhat run scripts/deposit.js --network mainnet
 */
async function main() {
  const [depositor] = await ethers.getSigners();
  console.log("Using wallet", depositor.address);

  //------------------------------------------------------
  // we need to approve the deployed contract to spend the LP tokens
  const UniswapV2Pair = await ethers.getContractFactory("UniswapV2Pair");
  const spiritSwapLP = UniswapV2Pair.attach(SpiritSwapLqdrFtmLPAddress);
  const amountToApprove = ethers.utils.parseEther("1");

  // does the contract have approval? let's verify it
  const preAllowance = await spiritSwapLP.allowance(
    depositor.address,
    DEPLOYED_CONTRACT
  );

  if (preAllowance.gt(0)) {
    console.log("Already approved", preAllowance.toString());
  }

  if (preAllowance.eq(0)) {
    console.log("Contract does not have approval, taking action");
    const ApproveToken = await spiritSwapLP.approve(
      DEPLOYED_CONTRACT,
      amountToApprove
    );
    await ApproveToken.wait();

    console.log(
      "Approved LP into the contract with the account:",
      amountToApprove.toString(),
      DEPLOYED_CONTRACT
    );
  }

  //------------------------------------------------------
  // now we can deposit the LP into the contract
  const LiquidDriverSoloCrypt = await ethers.getContractFactory(
    "LiquidDriverSoloCrypt"
  );
  const liquidDriverSoloCrypt = await LiquidDriverSoloCrypt.attach(
    DEPLOYED_CONTRACT
  );

  // before we do anything funky, lets see balances
  const preBalance = await spiritSwapLP.balanceOf(DEPLOYED_CONTRACT);
  console.log("preBalance", preBalance);

  //------------------------------------------------------
  // deposit the LP tokens into our contract
  const tx = await liquidDriverSoloCrypt.depositLP(amountToApprove, {
    gasLimit: 3000000,
    gasPrice: ethers.utils.parseUnits("3000", "gwei"),
  });
  console.log("Deposited, awaiting confirmation");
  console.log("tx", tx);

  await tx.wait();

  console.log(
    "Deposited into the contract with the account:",
    amountToApprove.toString()
  );
  return;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
