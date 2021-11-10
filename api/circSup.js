const express = require('express');
const router = express.Router({ mergeParams: true });
let BN = require('bignumber.js')
let Web3 = require('web3');
let web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/v3/8a3419d52e90487d962fec5f54aa2b56"));
const data = require('./data/data.json');


router.get('/', async (req, res) => {
    // var TotalSup = BN(8889445.739026597496781844).multipliedBy(1e18);
    try {
        let SGT = new web3.eth.Contract(data.abis.SGT, Web3.utils.toChecksumAddress(data.addresses.SGT));
        let TotalSup = await SGT.methods.totalSupply().call()
        var circSup = BN(TotalSup);
        // for (let address of data.addresses.Deployers) {
        //     let bal = await SGT.methods.balanceOf(address).call()
        //     circSup = circSup.minus(bal)
        // }
        for (let address of data.addresses.TimeLocked) {
            let bal = await SGT.methods.balanceOf(address).call()
            circSup = circSup.minus(bal)
        }
        for (let address of data.addresses.Staking) {
            let bal = await SGT.methods.balanceOf(address).call()
            circSup = circSup.minus(bal)
        }
        for (let address of data.addresses.Multisig) {
            let bal = await SGT.methods.balanceOf(address).call()
            circSup = circSup.minus(bal)
        }
        //add staked amount from SGT pool
        //let stakingContract = new web3.eth.Contract(data.abis.Staking, Web3.utils.toChecksumAddress("0xc637db981e417869814b2ea2f1bd115d2d993597"));
        //let staked = await stakingContract.methods.totalSupply().call()
        //circSup = circSup.plus(staked)
        circSup = circSup.dividedBy(1e18).toFixed(2)
        res.send(circSup)
    }
    catch (err) {
        console.log(err)
        res.status(404).json({ status: 'fail', msg: "no data available" })
    }
})

module.exports = router;
