module.exports = {
	//con todos los elementos del json creo el xml y lo agrego al payload
	parseToAuthorizeRequest:function(optionsAuthorize) {
		var payload = "<Request>";
		for(var key in optionsAuthorize) { 
			var value = optionsAuthorize[key]; 
			payload += "<" + key + ">" + value + "</" + key + ">";
		}
		payload += "</Request>";
		optionsAuthorize.Payload = payload;
		return optionsAuthorize;
	},	
	sendAutorizeRequest : function (options, parameters, callback){
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": options.endpoint
		};
		soap.createClient(options.wsdl, config, function(err, client) {
			var xml = module.exports.parseToAuthorizeRequest(parameters);
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
		var soap = require('soap');		
		process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
		var config = {
			"endpoint": options.endpoint
		};
		
		soap.createClient(options.wsdl, config, function(err, client) {
			var parameters = {
				'OPERATIONID': operationId, 
				'Merchant' 	 : merchant
				};
			client.GetByOperationId(parameters, function(err, result) {
				callback(result, err);
			},{}, {'Authorization': options.Authorization});
		});
	},
};
