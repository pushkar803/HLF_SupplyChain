/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');
var moment = require('moment-timezone');

class SupplyChain extends Contract {

    async queryBatch(ctx, batchNumber) {

        const batchAsBytes = await ctx.stub.getState(batchNumber);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            throw new Error(`${batchNumber} does not exist`);
        }
        console.log(batchAsBytes.toString());
        return batchAsBytes.toString();
    }

    async createBatch(ctx, org, batchNumber, accountId, latitude, longitude, quantity, status, comment) {

        console.info('============= START : Create Batch ===========');

        const batch = {
            history: [],
            latest: {
                accountId,
                latitude,
                longitude,
                quantity,
                status,
                org,
                comment,
                date: moment().format().toString()
            }
        };

        console.log(JSON.stringify(batch))

        await ctx.stub.putState(batchNumber, Buffer.from(JSON.stringify(batch)));
        console.info('============= END : Create Batch ===========');
    }

    async updateBatch(ctx, org, batchNumber, latitude, longitude, status, comment) {

        console.info('============= START : Update Batch ===========');

        const batchAsBytes = await ctx.stub.getState(batchNumber);
        if (!batchAsBytes || batchAsBytes.length === 0) {
            throw new Error(`${batchNumber} does not exist`);
        }
        const oldBatch = JSON.parse(batchAsBytes.toString());
        let newBatch = JSON.parse(JSON.stringify(oldBatch));
        newBatch.history.push(oldBatch.latest);
        newBatch.latest.latitude = latitude
        newBatch.latest.longitude = longitude
        newBatch.latest.org = org
        newBatch.latest.status = status
        newBatch.latest.comment = comment
        newBatch.latest.date = moment().format().toString()

        await ctx.stub.putState(batchNumber, Buffer.from(JSON.stringify(newBatch)));
        console.info('============= END : Update Batch ===========');
    }

}

module.exports = SupplyChain;
