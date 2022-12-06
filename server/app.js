'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const network = require('./fabric/network');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('GET called');
    res.send('Welcome To Supplichain Api World!');
});

app.post('/createBatch', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const batchJson = req.body;
        const org = req.org

        const result = await contract.submitTransaction('createBatch',
            org,
            batchJson._id,
            batchJson.latitude,
            batchJson.longitude,
            batchJson.quantity.toString(),
            batchJson.status,
            batchJson.comment
        );

        res.json({ result: result });

    } catch (error) {
        console.error('Failed to evaluate transaction:');
        console.error(error);
        res.status(500).json({
            error: error
        });
    }
});

app.post('/updateBatch', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const batchJson = req.body;
        const org = req.org

        const result = await contract.submitTransaction('updateBatch',
            org,
            batchJson._id,
            batchJson.latitude,
            batchJson.longitude,
            batchJson.status,
            batchJson.comment
        );

        res.json({ result: result });

    } catch (error) {
        console.error('Failed to evaluate transaction:');
        console.error(error);
        res.status(500).json({
            error: error
        });
    }
});

app.get('/getBatch/:id', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const productId = req.params.id.toString();

        console.log(productId)

        const result = await contract.evaluateTransaction('queryBatch', productId);
        const response = JSON.parse(result.toString());
        res.json({ result: response });
    } catch (error) {
        console.error('Failed to evaluate transaction:');
        console.error(error);
        res.status(500).json({
            error: error
        });
    }
});

app.listen(3003, () => {
    console.log('Listening on port 3003');
});