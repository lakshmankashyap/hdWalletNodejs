import Web3 from "web3";

/**
 * Web3 Connects To Ethereum Node
 */
let web3;

if (typeof web3 !== "undefined") {
  web3 = new Web3(web3.currentProvider);
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/c799a4c598c543658bf34565b9dae405"));
  web3.eth
    .getBlockNumber()
    .then((block) => {
     console.log("Current Block is ====> ", block);
    })
    .catch((er) => {
        console.log("Try again connection failed", er);
    });
}

export default web3
