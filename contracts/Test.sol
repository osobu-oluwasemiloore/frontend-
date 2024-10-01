// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TriviaGame {
    address public owner;
    uint256 public gameCounter;

    struct Game {
        address host;
        bool isActive;
    }

    mapping(uint256 => Game) public games;

    constructor() {
        owner = msg.sender;
    }

    function createGame() external {
        uint256 gameId = gameCounter++;
        games[gameId] = Game({
            host: msg.sender,
            isActive: true
        });
    }

    function endGame(uint256 _gameId) external {
        require(msg.sender == games[_gameId].host, "Not the game host");
        games[_gameId].isActive = false;
    }
}