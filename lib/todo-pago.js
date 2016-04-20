var versionTodoPago = '1.1.0';

var tenant = 't/1.1/';
var soapAppend = 'services/';
var soapAthorizeAppend = 'Authorize';
var soapOperationsAppend = 'Operations';
var restAppend = 'api/';

var User = require('../lib/User');



var wsdl = {
	operations: __dirname+"/Operations.wsdl",
	authorize: __dirname+"/Authorize.wsdl"
}

var endpoint = {
	production: 'https://apis.todopago.com.ar/',
	developers: 'https://developers.todopago.com.ar/'
}

module.exports = {
	//con todos los elementos del json creo el xml y lo agrego al payload
	parseToAuthorizeRequest:function(optionsAuthorize, fraudControl) {
		// optionsAuthorize["SDK"]="NodeJS";
		// optionsAuthorize["SDKVERSION"]=versionTodoPago;
		// optionsAuthorize["LENGUAGEVERSION"]=process.version;
		
		var payload = "<Request>";
		for(var key in optionsAuthorize) { 
			var value = optionsAuthorize[key]; 
			payload += "<" + key + ">" + value + "</" + key + ">";
		}
		for(var key in fraudControl) { 
			var value = fraudControl[key]; 
			payload += "<" + key + ">" + value + "</" + key + ">";
		}
		payload += "</Request>";
		optionsAuthorize.Payload = payload;
		return optionsAuthorize;
	},	
	sendAutorizeRequest : function (options, parameters, fraudControl, callback){
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": endpoint[options.endpoint] + soapAppend + tenant + soapAthorizeAppend
		};
		soap.createClient(wsdl.authorize, config, function(err, client) {
			var xml = module.exports.parseToAuthorizeRequest(parameters, fraudControl);
			client.SendAuthorizeRequest(xml, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},
	getAutorizeAnswer : function (options, parameters, callback){
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": endpoint[options.endpoint] + soapAppend + tenant + soapAthorizeAppend
		};
		
		soap.createClient(wsdl.authorize, config, function(err, client) {
			//console.log(client.describe());
			client.GetAuthorizeAnswer(parameters, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},
	returnRequest : function (options, parameters, callback){
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": endpoint[options.endpoint] + soapAppend + tenant + soapAthorizeAppend
		};
		
		soap.createClient(wsdl.authorize, config, function(err, client) {
			//console.log(client.describe());
			client.ReturnRequest(parameters, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},
	voidRequest : function (options, parameters, callback){
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": endpoint[options.endpoint] + soapAppend + tenant + soapAthorizeAppend
		};
		
		soap.createClient(wsdl.authorize, config, function(err, client) {
			//console.log(client.describe());
			client.VoidRequest(parameters, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},


	getStatus : function (options, merchant, operationId, callback){
		var Client = require('node-rest-client').Client;
 		client = new Client();
 		client.get(endpoint[options.endpoint] + tenant + restAppend + "Operations/GetByOperationId/MERCHANT/" + merchant + "/OPERATIONID/" + operationId, function(data, response){
			var aux = data.toString('utf-8');
			var parseString = require('xml2js').parseString;
			parseString(aux, function (err, result) {
				//Mantener consistencia con verciones anteriores
				var ret = {
					'Operations' : result.OperationsColections.Operations,
				};
				callback(ret, err);
			});
		});
	},

	getPaymentMethods : function (options, merchant, callback){
		var Client = require('node-rest-client').Client;
 		client = new Client();
		client.get(endpoint[options.endpoint]  + tenant + restAppend + "/PaymentMethods/Get/MERCHANT/" + merchant, function(data, response){
			var aux = data.toString('utf-8');
			var parseString = require('xml2js').parseString;
			parseString(aux, function (err, result) {
				var ret = {
					'PaymentMethodsCollection' : result.Result.PaymentMethodsCollection,
					'BanksCollection' : result.Result.BanksCollection,
					'PaymentMethodBanksCollection' : result.Result.PaymentMethodBanksCollection,
				};
				callback(ret, err);
			});
		});
	},
	
	getByRangeDateTime : function (options, parameters, callback){
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": endpoint[options.endpoint]  + soapAppend + tenant + soapOperationsAppend
		};
		
		soap.createClient(wsdl.operations, config, function(err, client) {
			//console.log(client.describe());
			client.GetByRangeDateTime(parameters, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},


	getCredentials : function (email, pass, options , callback){
		var config = {
			"endpoint": endpoint[options.endpoint] + 'api/Credentials'
		};

		User = new User.Create(email, pass, config);
		User.getCredentials(function(result, err){
		//	console.log("-------------------***-------------------");
		//	console.log("getCredentials");
		//	console.log(result);
			User.merchantId = result.merchantId;
			User.apiKey = result.apiKey;
			callback(result, err);
		//	console.log(err);
		//	console.log("-------------------***-------------------");
		});

	}

};
