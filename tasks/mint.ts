import {task} from "hardhat/config";

task("mint", "Mint")
    .addParam("token", "Token")
    .addParam("to", "Address to")
    .addParam("tokenid", "Token id")
    .addParam("uri", "URI")
    .setAction(async (taskArgs, {ethers}) => {
            console.log("Started")

            const tokenFactory = await ethers.getContractFactory("NFT721")
            const token = tokenFactory.attach(taskArgs.token)

            await token.mint(taskArgs.to, taskArgs.tokenid, taskArgs.uri)

            console.log("Finished")
    })
