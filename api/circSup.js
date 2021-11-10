const express = require('express');
const router = express.Router({ mergeParams: true });
const { ethers } = require("ethers");
const provider = new ethers.providers.InfuraProvider("homestead", "8a3419d52e90487d962fec5f54aa2b56");

const data = require('./data/data.json');

router.get('/', async (req, res) => {
    try {
        const SGT = new ethers.Contract(data.addresses.SGT, data.abis.SGT, provider)

        let circSup = await SGT.totalSupply()
        const deductLockedBal = async (address) => {
            let bal = await SGT.balanceOf(address)
            circSup = circSup.sub(bal)
        }
        for (let address of data.addresses.TimeLocked) {
            await deductLockedBal(address)
        }
        for (let address of data.addresses.Staking) {
            await deductLockedBal(address)
        }
        for (let address of data.addresses.Multisig) {
            await deductLockedBal(address)
        }
        circSup = circSup.div(ethers.constants.WeiPerEther).toNumber().toFixed(2)
        res.send(circSup)
    }
    catch (err) {
        console.log(err)
        res.status(404).json({ status: 'fail', msg: "no data available" })
    }
})

module.exports = router;
