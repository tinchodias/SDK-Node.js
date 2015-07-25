var sdk = require('../lib/todo-pago');

var options = {
	wsdl : 'https://23.23.144.247:8243/services/Authorize?wsdl',
	endpoint : "https://23.23.144.247:8243/services/Authorize",	
	Authorization:'PRISMA 912EC803B2CE49E4A541068D495AB570'
};

exampleSendAuthorizeRequest();
exampleGetAuthorizeAnswer();
exampleGetStatus();

function exampleGetStatus(){
	options.endpoint= "https://23.23.144.247:8243/services/Operations";
	options.wsdl= "https://23.23.144.247:8243/services/Operations?wsdl";
	sdk.getStatus(options, '305', '01', function(result, err){
		console.log("getStatus");
		console.log(result);
		console.log(err);
		console.log("-------------------");
	});
} 
 
function exampleGetAuthorizeAnswer(){
	var parameters = {
		'Security'   : '1234567890ABCDEF1234567890ABCDEF', 
		'Merchant' 	 : '305',
		'RequestKey' : '59a7ac16-5c02-a4e9-d9a7-f2a5a2a13bbf',
		'AnswerKey'  : '2ac538eb-d69f-e940-ed91-a4951b85e0bc'
	};
	sdk.getAutorizeAnswer(options, parameters, function(result, err){
		console.log("getAutorizeAnswer");
		console.log(result);
		console.log(err);
		console.log("-------------------");
	});
} 
function exampleSendAuthorizeRequest(){
	var parameters = {
		'Security':'1234567890ABCDEF1234567890ABCDEF',
		'EncodingMethod':'XML',
		'Merchant':305,
		'URL_OK':'localhost:8888/sdk-php/ejemplo/success.php',
		'URL_ERROR':'localhost:8888/sdk-php/ejemplo/fail.php',
		'MERCHANT': "305",
		'OPERATIONID':"01",
		'CURRENCYCODE': 032,
		'AMOUNT':"54"
	};
	
	sdk.sendAutorizeRequest(options, parameters, function(result, err){
		console.log("sendAutorizeRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------");
	});
}
