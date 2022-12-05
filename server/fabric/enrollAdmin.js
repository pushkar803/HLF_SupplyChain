/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const { capitalize } = require('./misc');
var config = require('../config.json');

async function main() {
    config.orgs.forEach((org, index) => {
        createAdminForOrgs(org)
    })
}

async function createAdminForOrgs(orgName) {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'fablo-target', 'fabric-config', 'connection-profiles', 'connection-profile-' + orgName + '.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.' + orgName + '.example.com'];
        //const caTLSCACerts = caInfo.tlsCACerts.pem;

        const ca = new FabricCAServices(caInfo.url, { /*trustedRoots: caTLSCACerts,*/ verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet', orgName);
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // Check to see if we've already enrolled the admin user.
        const identity = await wallet.get('admin');
        if (identity) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: capitalize(orgName) + 'MSP',
            type: 'X.509',
        };
        await wallet.put('admin', x509Identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        return;
    }
}

main();
