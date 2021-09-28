// --------------------------------------------------------
// VERSION 0.4.17

contract Lottery {
    address public manager;
    address[] public players;

    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .001 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint256) {
        return uint256(keccak256(block.difficulty, now, players));
    }
    
    function pickWinner() public restricted {
        uint256 index = random() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}


// --------------------------------------------------------
// VERSION 0.8.7

// SPDX-License-Identifier: GPL-3.0
// pragma solidity ^0.8.7;

// contract Inbox {
//     string public message;
    
//     constructor(string memory initialMessage) {
//         message = initialMessage;
//     }
    
//     function setMessage(string memory newMessage) public {
//         message = newMessage;
//     }
// }