// --------------------------------------------------------
// VERSION 0.4.17

const path = require('path');
const fs = require('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':Lottery'];


// --------------------------------------------------------
// VERSION 0.8.7

// const path = require('path');
// const fs = require('fs');
// const solc = require('solc');

// const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
// const source = fs.readFileSync(inboxPath, 'utf8');

// const input = {
//     language: 'Solidity',
//     sources: {
//       'Inbox.sol': {
//         content: source
//       }
//     },
//     settings: {
//       outputSelection: {
//         '*': {
//           '*': [ "abi", "evm.bytecode"]
//         }
//       }
//     }
//   };

// const output = JSON.parse(solc.compile(JSON.stringify(input)))
// module.exports = output.contracts['Inbox.sol'].Inbox;