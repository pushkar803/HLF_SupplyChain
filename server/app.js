'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const network = require('./fabric/network');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    console.log('GET called');
    res.send('Hello world!');
});

app.get('/initledger', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const result = await contract.evaluateTransaction('initLedger');
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

app.post('/createCar', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const carJson = req.body;

        const result = await contract.submitTransaction('createCar',
            carJson.carNumber,
            carJson.make,
            carJson.model,
            carJson.color,
            carJson.owner
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

app.get('/queryCar/:id', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const productId = req.params.id.toString();

        const result = await contract.evaluateTransaction('queryCar', productId);
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

app.get('/queryAllCars', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;

        const result = await contract.evaluateTransaction('queryAllCars');
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

app.post('/changeCarOwner', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const shipDetails = req.body;

        const result = await contract.submitTransaction('changeCarOwner',
            shipDetails.carNumber,
            shipDetails.newOwner
        );
        console.log(result);
        res.json({ status: 'Transaction submitted.', txId: result.toString() });
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


app.post('/simpleAdd', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const batchJson = req.body;

        console.log(batchJson)

        let k = batchJson.k
        let v = batchJson.v

        console.log(k, v)

        const result = await contract.submitTransaction('put', k, v);
        res.json({ result: result });

    } catch (error) {
        console.error('Failed to evaluate transaction:');
        console.error(error);
        res.status(500).json({
            error: error
        });
    }
});

app.get('/simpleGet/:key', network.connectToNetwork, async (req, res) => {
    try {
        const contract = req.contract;
        const k = req.params.key.toString();

        console.log(k)

        const result = await contract.evaluateTransaction('get', k);
        const response = result.toString();
        res.json({ result: response });
    } catch (error) {
        console.error('Failed to evaluate transaction:');
        console.error(error);
        res.status(500).json({
            error: error
        });
    }
});