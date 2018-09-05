'use strict';

var express = require('express');
var braintree = require('braintree');
var router = express.Router(); // eslint-disable-line new-cap
var gateway = require('../lib/gateway');

var TRANSACTION_SUCCESS_STATUSES = [
  braintree.Transaction.Status.Authorizing,
  braintree.Transaction.Status.Authorized,
  braintree.Transaction.Status.Settled,
  braintree.Transaction.Status.Settling,
  braintree.Transaction.Status.SettlementConfirmed,
  braintree.Transaction.Status.SettlementPending,
  braintree.Transaction.Status.SubmittedForSettlement
];

function formatErrors(errors) {
  var formattedErrors = '';

  for (var i in errors) { // eslint-disable-line no-inner-declarations, vars-on-top
    if (errors.hasOwnProperty(i)) {
      formattedErrors += 'Error: ' + errors[i].code + ': ' + errors[i].message + '\n';
    }
  }
  return formattedErrors;
}

function createResultObject(transaction) {
  var result;
  var status = transaction.status;

  if (TRANSACTION_SUCCESS_STATUSES.indexOf(status) !== -1) {
    result = {
      header: 'Sweet Success!',
      icon: 'success',
      message: 'Your test transaction has been successfully processed. See the Braintree API response and try again.'
    };
  } else {
    result = {
      header: 'Transaction Failed',
      icon: 'fail',
      message: 'Your test transaction has a status of ' + status + '. See the Braintree API response and try again.'
    };
  }

  return result;
}


/***************** Token *********************************/

router.get('/token', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
     response.success;
     // true

     //test

     res.json(response);
  });
});


/***************** customer info **************************/
router.get('/customer/new', function (req, res) {
 


  gateway.customer.create({
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    company: req.query.company,
    email: req.query.email,
  }, function (err, result) {
  result.success;
  // true

  result.customer.id;

  res.json(result);
  // e.g. 494019
});
});



router.get('/customer/find', function (req, res) {
 
gateway.customer.find(req.query.customerId, function(err, customer) {

  result.success;
  // true

  result.customer;
  // e.g. 494019
});

});


router.get('/customer/update', function (req, res) {
 
gateway.customer.update(req.query.customerId, {
  paymentMethodNonce: req.query.nonceFromTheClient,
}, function (err, result) {

  result.success;
  // true

  res.json(result);
  // e.g. 494019
});
});


/****************** Payment Method ******************/



router.get('/paymentMethod/create', function (req, res) {
 

  gateway.paymentMethod.create({
    customerId: req.query.customerId,
    paymentMethodNonce: req.query.nonceFromTheClient,
  }, function (err, result) { 

    result.success;
    // true

    res.json(result);
  });

});



router.post('/paymentMethods/find', function (req, res) {
 
 

  gateway.paymentMethod.find( req.body.payToken, function (err, result) { 

    result.success;
    // true

    res.json(result);
  });

});



router.get('/paymentMethod/get', function (req, res) {
 

 res.json(req);
/*
  gateway.paymentMethod.find({
    token: req.query.paymentMethodId,
  }, function (err, result) { 

    if (err) {
        res.json(err);
      }
      else{

       res.success;
       res.json(result);
    }
  });
*/
});

/****************** Subscription ********************/

router.get('/subscription/new', function (req, res) {



    gateway.subscription.create({
      paymentMethodToken: req.query.token,
      planId: "436w"
    }, function (err, result) {

      res.json(result);

    });


});


router.get('/subscription/cancel', function (req, res) {

  
  gateway.subscription.cancel(req.query.subscriptionId, function (err, result) {


      res.json(result);
  });


});
/****************** Merchant ************************/

router.post('/merchant/new', function (req, res) {

/*
  var merchantAccountParams = req.body;
  //res.json(merchantAccountParams);
  
  gateway.merchantAccount.create(merchantAccountParams, function (err, result) {

      if (err) {
        res.json(err);
      }
      else{

       result.success;
       result.json(result);
      }
  });
  */


  var merchant_id = "newsubmerchantid";//req.body.merchant_id;
  var bank_account = req.body.funding.accountNumber;//"1123581321";//req.body.bank_account;
  var bank_routing = req.body.funding.routingNumber;//"071101307";//req.body.bank_routing;


  var merchantAccountParams;

  if (req.body.individual) {


  var firstNamePram = req.body.individual.firstName;
  var lastNamePram = req.body.individual.lastName;
  var emailPram = req.body.individual.email;
  var phonePram = req.body.individual.phone;
  var dobPram = req.body.individual.dateOfBirth;
  var ssnPram = req.body.individual.ssn;
  var streetPram = req.body.individual.address.streetAddress;
  var cityPram = req.body.individual.address.locality;
  var statePram = req.body.individual.address.region;
  var zipPram = req.body.individual.address.postalCode;

    merchantAccountParams= {
        individual: {
          firstName: firstNamePram,
          lastName: lastNamePram,
          email: emailPram,
          phone: phonePram,
          dateOfBirth: dobPram,
          ssn: ssnPram,
          address: {
            streetAddress: streetPram,
            locality: cityPram,
            region: statePram,
            postalCode: zipPram
          }
        },
        funding: {
          destination: braintree.MerchantAccount.FundingDestination.Bank,
          accountNumber: bank_account,
          routingNumber: bank_routing
        },
        tosAccepted: true,
        masterMerchantAccountId: "aeiwaydevelopmentid"
      };
  }
  else{
   
    var legalNamePram = req.body.business.legalName;
    var dbaNamePram = req.body.business.dbaName;
    var taxIdPram = req.body.business.taxId;
    var streetAddressePram = req.body.business.address.streetAddress;
    var localityPram = req.body.business.address.locality;
    var regionPram = req.body.business.address.region;
    var postalCodePram = req.body.business.address.postalCode;
    


    merchantAccountParams= {
    bussiness: {
      legalName: legalNamePram,
      dbaName: dbaNamePram,
      taxId: taxIdPram,
      address: {
        streetAddress: streetAddressePram,
        locality: localityPram,
        region: regionPram,
        postalCode: postalCodePram
      }
    },
    funding: {
      destination: braintree.MerchantAccount.FundingDestination.Bank,
      accountNumber: bank_account,
      routingNumber: bank_routing
    },
    tosAccepted: true,
    masterMerchantAccountId: "aeiwaydevelopmentid"
  };
  }

  //res.json(merchantAccountParams);

   

  gateway.merchantAccount.create(merchantAccountParams, function (err, result) {

     if (err) {
        res.json(err);
      }
      else{

       res.success;
       res.json(result);
      }
  });

});


router.get('/merchant/find', function (req, res) {


  gateway.merchantAccount.find(req.body.merchantId, function (err, result) {

  result.success;
  // true

  res.json(result);
  });

});


router.post('/merchant/update', function (req, res) {

  gateway.merchantAccount.update(req.body.merchantAccountId, function (err, result) {

  result.success;
  // true

  res.json(result);
  });

});

/***************** transatcion **************************/

router.get('/transaction/new', function (req, res) {



  gateway.transaction.sale({
    merchantAccountId: req.query.providerSubMerchantAccount,
    amount: req.query.amount,
    paymentMethodToken: req.query.paymentMethodToken,
    serviceFeeAmount: req.query.serviceFeeAmount
  }, function (err, result) {
      if (err) {
        res.json(err);
      }
      else{

       res.success;
       res.json(result);
      }
  });

});



router.get('/', function (req, res) {
  res.redirect('/checkouts/new');
});

router.get('/checkouts/new', function (req, res) {
  gateway.clientToken.generate({}, function (err, response) {
    res.render('checkouts/new', {clientToken: response.clientToken, messages: req.flash('error')});
  });
});

router.get('/checkouts/:id', function (req, res) {
  var result;
  var transactionId = req.params.id;

  gateway.transaction.find(transactionId, function (err, transaction) {
    result = createResultObject(transaction);
    res.render('checkouts/show', {transaction: transaction, result: result});
  });
});

router.post('/checkouts', function (req, res) {
  var transactionErrors;
  var amount = req.body.amount; // In production you should not take amounts directly from clients
  var nonce = req.body.payment_method_nonce;

  gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true
    }
  }, function (err, result) {
    if (result.success || result.transaction) {
      res.redirect('checkouts/' + result.transaction.id);
    } else {
      transactionErrors = result.errors.deepErrors();
      req.flash('error', {msg: formatErrors(transactionErrors)});
      res.redirect('checkouts/new');
    }
  });
});

module.exports = router;
