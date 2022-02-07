import Mnemonic from 'bitcore-mnemonic';
import bitcore from 'bitcore-lib'
import Wallet from "ethereumjs-wallet/hdkey.js";
import {Web3Helper} from './helpers/index.js'


let Address = bitcore.Address;
let PublicKey = bitcore.PublicKey;
let Networks = bitcore.Networks;

const code = new Mnemonic("opera earth shift expect bless essay today element wide elephant gown margin");
let codeString = code.toString();
console.log('codeString',codeString)

let valid = Mnemonic.isValid(codeString);
console.log('isValid Mnemonic ',valid)

let seed = code.toSeed();
console.log('BIP32 passpharse ',seed)


let xpriv1 = code.toHDPrivateKey(); // no passphrase
console.log('BIP32 root key xpriv1 ',xpriv1.toString())

// let xpriv2 = code.toHDPrivateKey('testing pharse'); // using a passphrase
// console.log('BIP32 root key xpriv2 ',xpriv2.toString())


let etherumHd = new Mnemonic(codeString).toHDPrivateKey('', 'mainnet');

//BIP32 Derivation Path and get BIP32 Extended Private Key
let ethPrivateKey = etherumHd.deriveChild("m/44'/0'/0'/0");

// BIP32 Extended Public Key
let ethPublicKey = new bitcore.HDPublicKey(ethPrivateKey);

// add a drive path for get child
var derived = ethPrivateKey.deriveChild("m/0"); // see deprecation warning for derive

// Public Key 
var pubkey = new PublicKey(derived.publicKey);
// Address
var address = Address.fromPublicKey(pubkey, Networks.mainnet);





console.log('\netherumHd ',etherumHd.toString())
console.log('\nethPrivateKey ',ethPrivateKey.toString())
console.log('\nethPublicKey ',ethPublicKey.toString())
console.log('\nderived ',derived.toString())
console.log('\nderivedpublicKey ',derived.publicKey.toString())
console.log('address',address.toString());

console.log('\nderivedprivateKeyWIF',derived.privateKey.toWIF())
console.log('\nderivedprivateKeySTRING',derived.privateKey.toString())


// exit xpriv in env
// let etherumHdExits = xpriv1
// let ethPublicKeyExit = new bitcore.HDPublicKey(ethPrivateKeyExit);
// let ethPrivateKeyExit = etherumHdExits.deriveChild("m/44'/0'/0'/0");
// console.log('\nethPrivateKeyExit ',ethPrivateKeyExit.toString())
// console.log('\nethPublicKeyExit ',ethPublicKeyExit.toString())


// 1. how can get BIP39 Seed
// 2. Account Extended Private Key
// 3. Account Extended Public Key


let firstEthPublicKey = Wallet.fromExtendedKey(ethPublicKey.toString()).derivePath(`m/0`).getWallet();
let addressEth = firstEthPublicKey.getAddress();
let addressETH = `0x${addressEth.toString('hex')}`;
console.log('\naddressEth',addressEth)
console.log('\naddressETH',addressETH)

// get ether balance of address
let balance = await Web3Helper.getBalance(addressETH)

console.log(balance + " ETH");

let gasPrice = await Web3Helper.getCurrentGasPrices();

console.log("gasPrice:",gasPrice);

let getBlocks = await Web3Helper.getBlock(10125842)

// The format which contains capital letters is called checksum format
if(getBlocks.hasOwnProperty('transactions')){
    for(let i=0;i<getBlocks.transactions.length;i++){
        let details = await Web3Helper.getTransaction(getBlocks.transactions[i])
        if(details.hasOwnProperty('to') && details.to !=null){
            if(details.to.toLowerCase() === addressETH.toLowerCase()){
                let val = await Web3Helper.valFromWei(details.value,'ether');
                console.log('val',val)
            }
        }
    }
}

// transactions
// await transferFund({address:addressETH, privateKey: '1x11111111'},{address: '0x0e356Ea698751bbed15dbd975ebD0d845191938E'},0.00001)
