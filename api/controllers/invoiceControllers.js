'use strict';

var database = require('../../database');

exports.getAllInvoices = async function(req, res) {
    try {
        var client = await database.connect();
        const result = await client.query('SELECT invoice_number,invoice_date,customer_id,amount::float FROM invoice');

        var status = 200;
        res.json(result.rows);

        await client.release();

        res.status(status).end();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};

exports.createInvoice = async function(req, res) {
    var invoice = req.body;
    console.log('invoice: ' + invoice);
    try {
        var id = invoice.invoice_number;
        if(!id) {
            res.status(400).json({ 'error': 'invoice_number is required'}).end();
            return;
        }

        var status = 201;

        var client = await database.connect();
        var result = await client.query('SELECT * FROM invoice where invoice_number = $1::text', [id]);
        if(result.rows.length > 0) { // do update
            result = await client.query('update invoice set customer_id = $2::text, invoice_date = $3::date, amount = $4::numeric where invoice_number = $1::text', 
                [id,
                 invoice.customer_id || null,
                 invoice.invoice_date || null,
                 invoice.amount || null]);
            status = 204;
        }
        else { // do insert
            result = await client.query('insert into invoice(invoice_number,customer_id,invoice_date,amount) values($1::text, $2::text, $3::date, $4::numeric)', 
                [id,
                 invoice.customer_id || null,
                 invoice.invoice_date || null,
                 invoice.amount || null]);
        }
        await client.release();
        res.status(status).end();

    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }
};



exports.getInvoice = async function(req, res) {
    var id = req.params.id;
    if(!id) {
        res.status(400).json({ 'error': 'invoice_number is required'}).end();
        return;
    }

    try {
        var client = await database.connect();
        const result = await client.query('SELECT * FROM invoice where invoice_number = $1::text', [id]);

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

exports.updateInvoice = async function(req, res) {
    var id = req.params.id;
    if(!id) {
        res.status(400).json({ 'error': 'invoice_number is required'}).end();
        return;
    }

    var invoice = req.body;

    try {
        var status = 204;

        var client = await database.connect();
        var result = await client.query('SELECT * FROM invoice where invoice_number = $1::text', [id]);
        if(result.rows.length > 0) { // do update
            result = await client.query('update invoice set customer_id = $2::text, invoice_date = $3::date, amount = $4::numeric where invoice_number = $1::text', 
                [id,
                 invoice.customer_id || null,
                 invoice.invoice_date || null,
                 invoice.amount || null]);
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

exports.deleteInvoice = async function(req, res) {
    var id = req.params.id;
    if(!id) {
        res.status(400).json({ 'error': 'invoice_number is required'}).end();
        return;
    }

    try {
        var client = await database.connect();
        const result = await client.query('DELETE FROM invoice where invoice_number = $1::text', [id]);

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