const LqdrAddress = "0x10b620b2dbac4faa7d7ffd71da486f5d44cd86f9";
const SpiritSwapLqdrFtmPoolId = 0;
const SpiritSwapLqdrFtmLPAddress = "0x4fe6f19031239f105f753d1df8a0d24857d0caa2";
const FarmProxyAddress = "0x6e2ad6527901c9664f016466b8DA1357a004db0f";
// const FarmRealAddress = "0x5CEE2988184afE3CD807e0178B394259E8cdC56C"; This is the MasterChefV2
const SpiritRouterAddress = "0x16327E3FbDaCA3bcF7E38F5Af2599D2DDc33aE52";
const OperatorAddress = "0x44b4d3Cb8087030A83B07ba2E2803e6D313Cf845";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const factory = await ethers.getContractFactory(
    "LiquidDriverVanillaYieldExtractor"
  );
  const contract = await factory.deploy(
    LqdrAddress,
    SpiritSwapLqdrFtmLPAddress,
    SpiritSwapLqdrFtmPoolId,
    FarmProxyAddress,
    SpiritRouterAddress,
    OperatorAddress
  );

  console.log("Contract address:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
