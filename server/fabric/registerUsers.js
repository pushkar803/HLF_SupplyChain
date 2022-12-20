/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const { capitalize } = require('./misc');
var config = require('../config.json');

async function main() {
    config.orgs.forEach(async (org, index) => {
        await createUsersForOrgs(org)
    })
}

async function createUsersForOrgs(orgName) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'fablo-target', 'fabric-config', 'connection-profiles', 'connection-profile-' + orgName + '.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.' + orgName + "." + config.orgURL].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet', orgName);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the admin user.
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // register users with CA
        config.users.forEach(async (user, index) => {
            await registerIdentity(orgName, wallet, adminIdentity, ca, user);
        })

    } catch (error) {
        console.error(`Failed to enroll user "admin": ${error}`);
        return;
    }
}


async function registerIdentity(orgName, wallet, adminIdentity, ca, identity) {

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(identity);
    if (userIdentity) {
        console.log(`An identity for the user "${identity}" already exists for "${orgName}" in the wallet`);
        return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
        //affiliation: 'org1.department1',
        enrollmentID: identity,
        role: 'client'
    }, adminUser);

    const enrollment = await ca.enroll({
        enrollmentID: identity,
        enrollmentSecret: secret
    });

    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: capitalize(orgName) + 'MSP',
        type: 'X.509',
    };

    await wallet.put(identity, x509Identity);
    console.log(`Successfully registered and enrolled user "${identity}" and imported it into the wallet`);
}

main();
