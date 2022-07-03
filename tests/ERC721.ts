import {expect} from "chai";
import {ethers} from "hardhat";

describe("Token contract", function () {
    it('Check balance of owner', async () => {
        const [owner] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("NFT721");
        const token = await tokenFactory.deploy();

        expect(await token.name()).to.equal("NFT721");
        expect(await token.symbol()).to.equal("NFTT");

        const ownerBalance = await token.balanceOf(owner.address);
        expect(ownerBalance).to.equal("1");
    });

    it("Get URI by tokenId", async () => {
        const [owner, acc1] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("NFT721");
        const token = await tokenFactory.deploy();

        const testUri = "testUri";
        await token.mint(acc1.address, 2, testUri);

        expect(await token.tokenURI(2)).to.equal(testUri);
    });

    it("Get owner by tokenId", async () => {
        const [owner, acc1] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("NFT721");
        const token = await tokenFactory.deploy();

        const ownerAddress = await token.ownerOf(1);
        expect(owner.address).to.equal(ownerAddress);

        const testUri = "testUri";
        await token.mint(acc1.address, 2, testUri);

        const acc1Address = await token.ownerOf(2);
        expect(acc1.address).to.equal(acc1Address);
    });

    it("Transfer tokenId owner to acc1", async () => {
        const [owner, acc1] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("NFT721");
        const token = await tokenFactory.deploy();

        const ownerTokenId = 1;
        let ownerAddress = await token.ownerOf(ownerTokenId);
        expect(owner.address).to.equal(ownerAddress);

        await token.transferFrom(owner.address, acc1.address, ownerTokenId);

        ownerAddress = await token.ownerOf(ownerTokenId);
        expect(acc1.address).to.equal(ownerAddress);
    });

    it("Approved tokenId owner to acc1", async () => {
        const [owner, acc1] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("NFT721");
        const token = await tokenFactory.deploy();

        const ownerTokenId = 1;
        let ownerAddress = await token.ownerOf(ownerTokenId);
        expect(owner.address).to.equal(ownerAddress);

        await token.approve(acc1.address, ownerTokenId);
        let addressApproved = await token.getApproved(ownerTokenId);
        expect(acc1.address).to.equal(addressApproved);
    });

    it("Safe transfer tokenId owner to acc1", async () => {
        const [owner, acc1] = await ethers.getSigners();
        const tokenFactory = await ethers.getContractFactory("NFT721");
        const token = await tokenFactory.deploy();

        const ownerTokenId = 1;
        let ownerAddress = await token.ownerOf(ownerTokenId);
        expect(owner.address).to.equal(ownerAddress);

        await token.approve(acc1.address, ownerTokenId);
        let addressApproved = await token.getApproved(ownerTokenId);
        expect(acc1.address).to.equal(addressApproved);

        ownerAddress = await token.ownerOf(ownerTokenId);
        expect(owner.address).to.equal(ownerAddress);

        await token['safeTransferFrom(address,address,uint256)'](owner.address, acc1.address, ownerTokenId);

        ownerAddress = await token.ownerOf(ownerTokenId);
        expect(owner.address).to.not.equal(ownerAddress);

        ownerAddress = await token.ownerOf(ownerTokenId);
        expect(acc1.address).to.equal(ownerAddress);
    });
});
