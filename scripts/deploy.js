const LqdrAddress = "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9";
const SpiritSwapLqdrFtmPoolId = 0;
const SpiritSwapLqdrFtmLPAddress = "0x4fe6f19031239f105f753d1df8a0d24857d0caa2";
const FarmProxyAddress = "0x6e2ad6527901c9664f016466b8DA1357a004db0f";
// const FarmRealAddress = "0x5CEE2988184afE3CD807e0178B394259E8cdC56C"; This is the MasterChefV2
const SpiritRouterAddress = "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52";
const OperatorAddress = "0x44b4d3Cb8087030A83B07ba2E2803e6D313Cf845";

/**
 * DEPLOYMENT
 * npx hardhat run scripts/deploy.js --network mainnet
 *
 * VERIFICATION
 * npx hardhat verify --network mainnet 0x61f7AeeBF4c6b371e1989fF87Adf7D82215A208e 0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9 0x4fe6f19031239f105f753d1df8a0d24857d0caa2 0x6e2ad6527901c9664f016466b8DA1357a004db0f 0 0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52 0x44b4d3Cb8087030A83B07ba2E2803e6D313Cf845
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const factory = await ethers.getContractFactory("LiquidDriverSoloCrypt");

  const contract = await factory
    .connect(deployer)
    .deploy(
      LqdrAddress,
      SpiritSwapLqdrFtmLPAddress,
      FarmProxyAddress,
      SpiritSwapLqdrFtmPoolId,
      SpiritRouterAddress,
      OperatorAddress
    );

  console.log("Contract address:", contract.address);
  console.log("");
  console.log("Please verify the contract");
  console.log(
    `npx hardhat verify --network mainnet ${contract.address} ${LqdrAddress} ${SpiritSwapLqdrFtmLPAddress} ${FarmProxyAddress} ${SpiritSwapLqdrFtmPoolId} ${SpiritRouterAddress} ${OperatorAddress}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
