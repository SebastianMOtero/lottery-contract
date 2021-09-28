// --------------------------------------------------------
// VERSION 0.4.17

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require('../compile');

let accounts;
let lottery;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts()

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode })
        .send({ from: accounts[0], gas: '1000000' })
});

describe('Lottery', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    })

    it('allows one account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(1, players.length);
    })

    it('allows multiple account to enter', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.011', 'ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.011', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3, players.length);
    })

    it('requires a minimum amount of ether to enter', async() => {
        try {
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.01', 'ether')
            });
            assert(false);
        } catch (error) {
            assert(error)
        }
    });

    it('only manager can call pickWinner', async() => {
        try {
            await lottery.methods.pickWinner().call({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error)
        }
    });

    it('sends money to the winner and resets the players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialBalance = await web3.eth.getBalance(accounts[0]);
        const initialPlayers = await lottery.methods.getPlayers().call();

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        })

        const finalBalance = await web3.eth.getBalance(accounts[0]);

        const difference = finalBalance - initialBalance;
        const finalPlayers = await lottery.methods.getPlayers().call();
        
        assert(difference > web3.utils.toWei('1.8', 'ether'));
        assert.equal(1, initialPlayers.length);
        assert.equal(0, finalPlayers.length);
    });
})


// --------------------------------------------------------
// VERSION 0.8.7

// const assert = require('assert');
// const ganache = require('ganache-cli');
// const { ethers } = require("ethers");

// // How to connect providers with ethers.js
// // https://docs.ethers.io/v4/cookbook-providers.html#testrpc-ganache
// // https://ethereum.org/es/developers/docs/apis/javascript/
// // ganache.provider() o window.ethereum

// const provider = new ethers.providers.Web3Provider(ganache.provider())
// const { abi, evm } = require('../compile');

// let accounts;
// let inboxContract;
// const INITIAL_MSG = 'Hi there!'

// beforeEach(async() => {
//     // Get a list of all accounts
//     accounts = await provider.listAccounts();
    
//     // Use one of those accounts to deploy the contract
//     // web3       https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html
//     // ethers.js  https://docs.ethers.io/v5/api/contract/contract/
//     // To create a new contract https://docs.ethers.io/v5/api/contract/contract-factory/

//     const signer = provider.getSigner();
//     const factory = await new ethers.ContractFactory(abi, evm.bytecode, signer);
//     inboxContract = await factory.deploy(INITIAL_MSG);
// });

// describe('Inbox', () => {
//     it('deploys a contract', () => {
//         assert.ok(inboxContract.address);
//     })

//     it('has a default message', async() => {
//         const message = await inboxContract.message();
//         assert.equal(message, INITIAL_MSG);
//     })

//     it('can change the message', async() => {
//         const newMessage = 'New message';
//         await inboxContract.setMessage(newMessage);
//         const message = await inboxContract.message();
//         assert.equal(message, newMessage);
//     });
// })