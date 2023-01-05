// 'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
var config = require('../config.json');

const IDENTITY = config.defaults.identity;
const CHANNEL = config.defaults.channel;
const CONTRACT = config.defaults.contract;

exports.connectToNetwork = async function (req, res, next) {
  try {
    var userRole = req.headers['user-role'];
    console.log("\n-------------")
    console.log("userRole: " + userRole)

    // load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', 'fablo-target', 'fabric-config', 'connection-profiles', 'connection-profile-' + userRole + '.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'fabric', 'wallet', userRole);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get(IDENTITY);
    if (!identity) {
      console.log(`An identity for the user "${IDENTITY}" does not exist in the wallet`);
      console.log('Run the registerAdmin.js script before retrying');
    }

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: IDENTITY, discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork(CHANNEL);
    const contract = network.getContract(CONTRACT);

    req.contract = contract;
    req.org = userRole;
    next();

  } catch (error) {
    eMsg = `Failed to submit transaction: ${error}`
    res.status(500).json({
      error: eMsg
    });
  }
};