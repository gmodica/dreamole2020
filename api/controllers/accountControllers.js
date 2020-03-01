'use strict';

var database = require('../../database');

exports.getAllAccounts = async function(req, res) {
    try {
        var client = await database.connect();
        const result = await client.query('SELECT sfid,name,customer_id__c FROM salesforce.account');

        var status = 200;
        res.json(result.rows);

        await client.release();

        res.status(status).end();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

exports.createAccount = async function(req, res) {
    var account = req.body;
    console.log('account: ' + account);
    try {
        var id = account.Customer_Id__c;
        if(!id) {
            res.status(400).json({ 'error': 'customer_id__c is required'}).end();
            return;
        }

        var status = 201;

        var client = await database.connect();
        var result = await client.query('SELECT * FROM salesforce.account where customer_id__c = $1::text', [id]);
        if(result.rows.length > 0) { // do update
            result = await client.query('update salesforce.account set name = $2::text where customer_id__c = $1::text', 
                [id,
                 account.Name || null]);
            status = 204;
        }
        else { // do insert
            result = await client.query('insert into salesforce.account(customer_id__c,name) values($1::text, $2::text)', 
                [id,
                 account.Name || null]);
        }
        await client.release();
        res.status(status).end();

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};



exports.getAccount = async function(req, res) {
    var id = req.params.id;
    if(!id) {
        res.status(400).json({ 'error': 'customer_id__c is required'}).end();
        return;
    }

    try {
        var client = await database.connect();
        const result = await client.query('SELECT * FROM salesforce.account where customer_id__c = $1::text', [id]);

        var status = 200;
        if(result.rows.length == 0) {
            status = 404;
        }
        else {
            res.json(result.rows);
        }

        await client.release();

        res.status(status).end();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

exports.updateAccount = async function(req, res) {
    var id = req.params.id;
    if(!id) {
        res.status(400).json({ 'error': 'customer_id__c is required'}).end();
        return;
    }

    var account = req.body;

    try {
        var status = 204;

        var client = await database.connect();
        var result = await client.query('SELECT * FROM salesforce.account where customer_id__c = $1::text', [id]);
        if(result.rows.length > 0) { // do update
            result = await client.query('update salesforce.account set name = $2::text, where customer_id__c = $1::text', 
                [id,
                 account.Name || null]);
        }
        else {
            status = 404;
        }
        await client.release();
        res.status(status).end();

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

exports.deleteAccount = async function(req, res) {
    var id = req.params.id;
    if(!id) {
        res.status(400).json({ 'error': 'customer_id__c is required'}).end();
        return;
    }

    try {
        var client = await database.connect();
        const result = await client.query('DELETE FROM salesforce.account where customer_id__c = $1::text', [id]);

        var status = 200;
        if(result.rows.length == 0) {
            status = 404;
        }

        await client.release();

        res.status(status).end();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};