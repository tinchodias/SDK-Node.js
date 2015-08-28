var versionTodoPago = '1.0.0';
module.exports = {
	//con todos los elementos del json creo el xml y lo agrego al payload
	parseToAuthorizeRequest:function(optionsAuthorize, fraudControl) {
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
			"endpoint": options.endpoint
		};
		soap.createClient(options.wsdl, config, function(err, client) {
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
			"endpoint": options.endpoint
		};
		
		soap.createClient(options.wsdl, config, function(err, client) {
			//console.log(client.describe());
			client.GetAuthorizeAnswer(parameters, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},

	getStatus : function (options, merchant, operationId, callback){
		var Client = require('node-rest-client').Client;
 		client = new Client();
		client.get(options.endpoint + "/api/Operations/GetByOperationId/MERCHANT/" + merchant + "/OPERATIONID/" + operationId, function(data, response){
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
		client.get(options.endpoint + "/api/PaymentMethods/Get/MERCHANT/" + merchant, function(data, response){
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
};
