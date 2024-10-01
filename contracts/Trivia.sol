// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";

contract TriviaGame is Ownable {
    uint256 public constant HOST_FEE_PERCENT = 500; // 5% hosting fee (using basis points)
    uint256 public constant FIRST_PLACE_PERCENT = 6000; // 60% for 1st place
    uint256 public constant SECOND_PLACE_PERCENT = 3000; // 30% for 2nd place
    uint256 public constant THIRD_PLACE_PERCENT = 1000; // 10% for 3rd place

    struct Game {
        address host;
        uint256 prizePool;
        bool isActive;
        bool isStaked;
        address[3] winners;
        uint256 participantCount;
    }

    mapping(uint256 => Game) public games;
    uint256 public gameCounter;

    event GameCreated(
        uint256 indexed gameId,
        address indexed host,
        uint256 prizePool,
        bool isStaked
    );
    event WinnersSet(
        uint256 indexed gameId,
        address first,
        address second,
        address third
    );
    event PrizesDistributed(
        uint256 indexed gameId,
        address first,
        uint256 firstPrize,
        address second,
        uint256 secondPrize,
        address third,
        uint256 thirdPrize
    );

    constructor() Ownable(msg.sender) {}

    function createGame(bool _isStaked) external payable {
        require(!_isStaked || msg.value > 0, "Staked games require ETH");

        uint256 prizePool = msg.value;
        if (_isStaked) {
            uint256 hostingFee = (prizePool * HOST_FEE_PERCENT) / 10000;
            prizePool -= hostingFee;
            payable(owner()).transfer(hostingFee);
        }

        uint256 gameId = gameCounter++;
        games[gameId] = Game({
            host: msg.sender,
            prizePool: prizePool,
            isActive: true,
            isStaked: _isStaked,
            winners: [address(0), address(0), address(0)],
            participantCount: 0
        });

        emit GameCreated(gameId, msg.sender, prizePool, _isStaked);
    }

    function participateInGame(uint256 _gameId) external {
        Game storage game = games[_gameId];
        require(game.isActive, "Game is not active");
        game.participantCount++;
    }

    function setWinners(
        uint256 _gameId,
        address _first,
        address _second,
        address _third
    ) external {
        Game storage game = games[_gameId];
        require(msg.sender == game.host, "Not the game host");
        require(game.isActive, "Game is not active");
        require(
            _first != address(0) &&
                _second != address(0) &&
                _third != address(0),
            "Invalid winner addresses"
        );

        game.winners = [_first, _second, _third];
        game.isActive = false;

        emit WinnersSet(_gameId, _first, _second, _third);

        if (game.isStaked) {
            distributePrizes(_gameId);
        }
    }

    function distributePrizes(uint256 _gameId) internal {
        Game storage game = games[_gameId];

        uint256 firstPrize = (game.prizePool * FIRST_PLACE_PERCENT) / 10000;
        uint256 secondPrize = (game.prizePool * SECOND_PLACE_PERCENT) / 10000;
        uint256 thirdPrize = (game.prizePool * THIRD_PLACE_PERCENT) / 10000;

        require(
            address(this).balance >= firstPrize + secondPrize + thirdPrize,
            "Not enough balance to distribute prizes"
        );

        payable(game.winners[0]).transfer(firstPrize);
        payable(game.winners[1]).transfer(secondPrize);
        payable(game.winners[2]).transfer(thirdPrize);

        emit PrizesDistributed(
            _gameId,
            game.winners[0],
            firstPrize,
            game.winners[1],
            secondPrize,
            game.winners[2],
            thirdPrize
        );
    }

    function getGameDetails(
        uint256 _gameId
    )
        external
        view
        returns (
            address host,
            uint256 prizePool,
            bool isActive,
            bool isStaked,
            address[3] memory winners,
            uint256 participantCount
        )
    {
        Game storage game = games[_gameId];
        return (
            game.host,
            game.prizePool,
            game.isActive,
            game.isStaked,
            game.winners,
            game.participantCount
        );
    }

    receive() external payable {
        revert("Cannot send ETH directly to contract");
    }
}
