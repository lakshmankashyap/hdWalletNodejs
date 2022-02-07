import web3 from '.././web3.js'
import axios from 'axios'

export let getCurrentGasPrices  = async()=>{
    let response = await axios.get('https://ethgasstation.info/json/ethgasAPI.json');
    let prices = {
      low: response.data.safeLow / 10,
      medium: response.data.average / 10,
      high: response.data.fast / 10
    };
    return prices;
}

export let getBalance =  async(address)=>{
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(address, async (err, result) => {
            if(err) {
                return reject(err);
            }
            resolve(web3.utils.fromWei(result, "ether"));
        });
    });
}

export let transferFund  = async(sendersData, recieverData, amountToSend)=>{
    return new Promise(async (resolve, reject) => {
        var nonce = await web3.eth.getTransactionCount(sendersData.address);
        web3.eth.getBalance(sendersData.address, async (err, result) => {
            if (err) {
                return reject();
            }
            let balance = web3.utils.fromWei(result, "ether");
            console.log(balance + " ETH");
            if(balance < amountToSend) {
                console.log('insufficient funds');
                return reject();
            }
   
            let gasPrices = await getCurrentGasPrices();
            let details = {
                "to": recieverData.address,
                "value": web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether')),
                "gas": 21000,
                "gasPrice": gasPrices.low * 1000000000,
                "nonce": nonce,
                "chainId": 4 // EIP 155 chainId - mainnet: 1, rinkeby: 4
            };
           
            const transaction = new EthereumTx(details, {chain: 'rinkeby'});
            let privateKey = sendersData.privateKey.split('0x');
            let privKey = Buffer.from(privateKey[1],'hex');
            transaction.sign(privKey);
           
            const serializedTransaction = transaction.serialize();
           
            web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'), (err, id) => {
                if(err) {
                    console.log(err);
                    return reject();
                }
                const url = `https://rinkeby.etherscan.io/tx/${id}`;
                console.log(url);
                resolve({id: id, link: url});
            });
        });
    });
}

export let getBlock = async(blockNumber)=>{
    return new Promise(async (resolve, reject) => {
        web3.eth.getBlock(blockNumber).then((res) => {
            // console.log('block detail', res)
            resolve(res);
        }).catch((e)=>{
            console.log(e);
            return reject();
        })
    })
} 

export let getTransaction = async(hash)=>{
    return new Promise(async (resolve, reject) => {
        web3.eth.getTransaction(hash).then((res) => {
            // console.log('block detail', res)
            resolve(res);
        }).catch((e)=>{
            console.log(e);
            return reject();
        })
    })
}

export let valFromWei = async(val,coin)=>{
    return new Promise(async (resolve, reject) => {
        let value = web3.utils.fromWei(val, coin);
        resolve(value)
    })
}

