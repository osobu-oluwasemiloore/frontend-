const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TriviaGame", function () {
  let triviaGame;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const TriviaGame = await ethers.getContractFactory("contracts/Trivia.sol:TriviaGame");
    triviaGame = await TriviaGame.deploy();
  });

  it("should allow a staked game to be created", async function () {
    const initialBalance = ethers.parseEther("1");
    await triviaGame.createGame(true, { value: initialBalance });

    const game = await triviaGame.games(0);
    const expectedPrizePool = initialBalance * 95n / 100n;

    expect(game.host).to.equal(owner.address);
    expect(game.prizePool).to.equal(expectedPrizePool);
    expect(game.isStaked).to.equal(true);
  });

  it("should allow a non-staked game to be created", async function () {
    await triviaGame.createGame(false);

    const game = await triviaGame.games(0);

    expect(game.host).to.equal(owner.address);
    expect(game.prizePool).to.equal(0);
    expect(game.isStaked).to.equal(false);
  });

  it("should allow participation in a game", async function () {
    await triviaGame.createGame(false);
    await triviaGame.connect(addr1).participateInGame(0);

    const game = await triviaGame.games(0);
    expect(game.participantCount).to.equal(1);
  });

  it("should allow setting winners for a game", async function () {
    await triviaGame.createGame(true, { value: ethers.parseEther("1") });
    await triviaGame.setWinners(0, addr1.address, addr2.address, owner.address);

    const [host, prizePool, isActive, isStaked, winners, participantCount] = await triviaGame.getGameDetails(0);

    expect(host).to.equal(owner.address);
    expect(isActive).to.equal(false);
    expect(isStaked).to.equal(true);
    expect(winners[0]).to.equal(addr1.address);
    expect(winners[1]).to.equal(addr2.address);
    expect(winners[2]).to.equal(owner.address);
  });
});