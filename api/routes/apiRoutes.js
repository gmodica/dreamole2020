'use strict';

module.exports = function(app) {
	var accountController = require('../controllers/accountControllers');
	var invoiceController = require('../controllers/invoiceControllers');

	// account routes
	app.route('/api/account')
    .get(accountController.getAllAccounts)
    .post(accountController.createAccount);

	app.route('/api/account/:id')
		.get(accountController.getAccount)
		.put(accountController.updateAccount)
		.delete(accountController.deleteAccount);


	// invoice routes
	app.route('/api/invoice')
    .get(invoiceController.getAllInvoices)
    .post(invoiceController.createInvoice);

	app.route('/api/invoice/:id')
		.get(invoiceController.getInvoice)
		.put(invoiceController.updateInvoice)
		.delete(invoiceController.deleteInvoice);
};