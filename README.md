<a name="inicio"></a>		
sdk-Node		
=======		
		
Modulo para conexión con gateway de pago Todo Pago		

######[Instalación](#instalacion)		
######[Versiones de php soportadas](#Versionesdephpsoportadas)
######[Generalidades](#general)	
######[Uso](#uso)		
######[Datos adicionales para prevencion de fraude] (#datosadicionales) 		
######[Ejemplo](#ejemplo)		
######[Modo test](#test)
######[Status de la operación](#status)
######[Consulta de operaciones por rango de tiempo](#statusdate)
######[Devoluciones](#devoluciones)
######[Diagrama de secuencia](#secuencia)
######[Tablas de referencia](#tablas)		

<a name="instalacion"></a>		
## Instalación		
Se debe descargar la última versión desde del botón Download ZIP o desde https://github.com/TodoPago/sdk-nodejs/archive/master.zip.
Una vez descargado y descomprimido, debe incluirse el archivo todo-pago.js como modulo del proyecto.

Instalar con [npm](http://github.com/isaacs/npm):

```
  npm install todo-pago
```
<br />
[<sub>Volver a inicio</sub>](#inicio)

<a name="Versionesdephpsoportadas"></a>		
## Versiones de node soportadas		
La versi&oacute;n implementada de la SDK, esta testeada para versiones desde Node 10.x en adelante.
<br />		
[<sub>Volver a inicio</sub>](#inicio)		

<a name="general"></a>
## Generalidades
Esta versión soporta únicamente pago en moneda nacional argentina (CURRENCYCODE = 32).
[<sub>Volver a inicio</sub>](#inicio)		


<a name="uso"></a>		
## Uso		
####1.Importar el modulo: 
   ```nodejs
   var sdk = require('../lib/todo-pago');
   ```
- crear dos objetos (uno de configuración y el otro con los parametros) 
- La configuración debe contar con el ApiKey provisto por Todo Pago

```nodejs
var parameters = {
};

var options = {
	endpoint : "developers", // "developers" o "production"	
	Authorization:'PRISMA f3d8b72c94ab4a06be2ef7c95490f7d3'
};
```

####2.Solicitud de autorización		
En este caso hay que llamar a sendAuthorizeRequest(), el resultado se obtendra mediante la funcion callback: 		
```nodejs	
var parameters = {
		'Session': 'ABCDEF-1234-12221-FDE1-00000200',
		'Security':'f3d8b72c94ab4a06be2ef7c95490f7d3',
		'EncodingMethod':'XML',
		'Merchant':2153,
		'URL_OK':'http,//someurl.com/ok/',
		'URL_ERROR':'http,//someurl.com/fail/'	
	};


var payload = {
		//operation:
		'MERCHANT': "2153",
		'OPERATIONID':"8000",
		'CURRENCYCODE': 032,
		'AMOUNT':"1.00",

		//Optionals
		'AVAILABLEPAYMENTMETHODSIDS': "1#194#43#45",
		'PUSHNOTIFYMETHOD' : "",
		'PUSHNOTIFYENDPOINT': "",  
		'PUSHNOTIFYSTATES': ""
	};

var callback = function(result, err){
	console.log(result);
	console.log(err);
}
sdk.sendAutorizeRequest(options, parameters, payload, callback);		
```		
<ins><strong>datos propios del comercio</strong></ins>		
 
####3.Confirmación de transacción.		
En este caso hay que llamar a getAuthorizeAnswer(), enviando como parámetro un objeto como se describe a continuación.		
```nodejs		
var parameters = {
		'Security'   : 'f3d8b72c94ab4a06be2ef7c95490f7d3', 
		'Merchant' 	 : '2153',
		'RequestKey' : '710268a7-7688-c8bf-68c9-430107e6b9da',
		'AnswerKey'  : '693ca9cc-c940-06a4-8d96-1ab0d66f3ee6'
	};
	
sdk.getAutorizeAnswer(options, parameters, function(result, err){
		console.log("getAutorizeAnswer");
		console.log(result);
		console.log(err);
		console.log("-------------------");
	});


```		
<strong><ins>*Importante:</ins></strong>El campo AnswerKey se adiciona  en la redireccion que se realiza a alguna de las direcciones ( URL ) epecificadas en el  servicio SendAurhorizationRequest, esto sucede cuando la transaccion ya fue resuelta y es necesario regresar al Site para finalizar la transaccion de pago, tambien se adiciona el campo Order, el cual tendra el contenido enviado en el campo OPERATIONID. para nuestro ejemplo: <strong>http://susitio.com/paydtodopago/ok?Order=27398173292187&Answer=1111-2222-3333-4444-5555-6666-7777</strong>		
		
Este método devuelve el resumen de los datos de la transacción.		
<br />		
		
[<sub>Volver a inicio</sub>](#inicio)		
		
<a name="datosadicionales"></a>		
## Datos adicionales para control de fraude

##### Parámetros Adicionales en el post inicial:		
```nodejs		
var payload = {		
'CSBTCITY':'Villa General Belgrano', //Ciudad de facturación, MANDATORIO.		
'CSBTCOUNTRY':'AR', //País de facturación. MANDATORIO. Código ISO. (http://apps.cybersource.com/library/documentation/sbc/quickref/countries_alpha_list.pdf)		
'CSBTCUSTOMERID':'453458', //Identificador del usuario al que se le emite la factura. MANDATORIO. No puede contener un correo electrónico.		
'CSBTIPADDRESS':'192.0.0.4', //IP de la PC del comprador. MANDATORIO.		
'CSBTEMAIL':'some@someurl.com', //Mail del usuario al que se le emite la factura. MANDATORIO.		
'CSBTFIRSTNAME':'Juan' ,//Nombre del usuario al que se le emite la factura. MANDATORIO.		
'CSBTLASTNAME':'Perez', //Apellido del usuario al que se le emite la factura. MANDATORIO.		
'CSBTPHONENUMBER':'541160913988', //Teléfono del usuario al que se le emite la factura. No utilizar guiones, puntos o espacios. Incluir código de país. MANDATORIO.		
'CSBTPOSTALCODE':'1010', //Código Postal de la dirección de facturación. MANDATORIO.		
'CSBTSTATE':'B', //Provincia de la dirección de facturación. MANDATORIO. Ver tabla anexa de provincias.		
'CSBTSTREET1':'Some Street 2153', //Domicilio de facturación (calle y nro). MANDATORIO.		
'CSBTSTREET2':'Piso 8', //Complemento del domicilio. (piso, departamento). NO MANDATORIO.		
'CSPTCURRENCY':'ARS', //Moneda. MANDATORIO.		
'CSPTGRANDTOTALAMOUNT':'125.38', //Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. MANDATORIO. (Ejemplos:$125,38-> 125.38 $12-> 12 o 12.00)		
'CSMDD7':'', // Fecha registro comprador(num Dias). NO MANDATORIO.		
'CSMDD8':'', //Usuario Guest? (Y/N). En caso de ser Y, el campo CSMDD9 no deberá enviarse. NO MANDATORIO.		
'CSMDD9':'', //Customer password Hash: criptograma asociado al password del comprador final. NO MANDATORIO.		
'CSMDD10':'', //Histórica de compras del comprador (Num transacciones). NO MANDATORIO.		
'CSMDD11':'', //Customer Cell Phone. NO MANDATORIO.	

//Retail
'CSSTCITY':'Villa General Belgrano', //Ciudad de enví­o de la orden. MANDATORIO.		
'CSSTCOUNTRY':'', //País de envío de la orden. MANDATORIO.		
'CSSTEMAIL':'some@someurl.com', //Mail del destinatario, MANDATORIO.		
'CSSTFIRSTNAME':'Jose', //Nombre del destinatario. MANDATORIO.		
'CSSTLASTNAME':'Perez', //Apellido del destinatario. MANDATORIO.		
'CSSTPHONENUMBER':'541155893737', //Número de teléfono del destinatario. MANDATORIO.		
'CSSTPOSTALCODE':'1010', //Código postal del domicilio de envío. MANDATORIO.		
'CSSTSTATE':'B', //Provincia de envío. MANDATORIO. Son de 1 caracter		
'CSSTSTREET1':'Some Street 2153', //Domicilio de envío. MANDATORIO.		
'CSMDD12':'',//Shipping DeadLine (Num Dias). NO MADATORIO.		
'CSMDD13':'',//Método de Despacho. NO MANDATORIO.		
'CSMDD14':'',//Customer requires Tax Bill ? (Y/N). NO MANDATORIO.		
'CSMDD15':'',//Customer Loyality Number. NO MANDATORIO. 		
'CSMDD16':'',//Promotional / Coupon Code. NO MANDATORIO. 		
//Datos a enviar por cada producto, los valores deben estar separado con #:		
'CSITPRODUCTCODE':'electronic_good', //Código de producto. CONDICIONAL. Valores posibles(adult_content;coupon;default;electronic_good;electronic_software;gift_certificate;handling_only;service;shipping_and_handling;shipping_only;subscription)		
'CSITPRODUCTDESCRIPTION':'Test Prd Description', //Descripción del producto. CONDICIONAL.		
'CSITPRODUCTNAME':'TestPrd', //Nombre del producto. CONDICIONAL.		
'CSITPRODUCTSKU':'SKU1234', //Código identificador del producto. CONDICIONAL.		
'CSITTOTALAMOUNT':'10.01', //CSITTOTALAMOUNT=CSITUNITPRICE*CSITQUANTITY "999999[.CC]" Con decimales opcional usando el puntos como separador de decimales. No se permiten comas, ni como separador de miles ni como separador de decimales. CONDICIONAL.		
'CSITQUANTITY':'1', //Cantidad del producto. CONDICIONAL.		
'CSITUNITPRICE':'10.01', //Formato Idem CSITTOTALAMOUNT. CONDICIONAL.			
	...........................................................		
```		
	
[<sub>Volver a inicio</sub>](#inicio)		
		
<a name="ejemplo"></a>		
## Ejemplo		
Existe un ejemplo en la carpeta https://github.com/TodoPago/SDK-Node.js/tree/master/ejemplo que muestra los resultados de los métodos principales del SDK.

Para ejecutar este ejemplo correr la linea de comando npm install y luego ejecutar node ejemplo.js
		
<a name="test"></a>		
## Modo Test		
Para utlilizar el modo test se debe pasar un end point de prueba (provisto por TODO PAGO).		
		
```nodejs		
var options = {
	endpoint : "developers",	
	Authorization:'PRISMA f3d8b72c94ab4a06be2ef7c95490f7d3'
}; // End Point = "developers" para test	
```		
[<sub>Volver a inicio</sub>](#inicio)	
<a name="status"></a>
## Status de la Operación
La SDK cuenta con un m&eacute;todo para consultar el status de la transacci&oacute;n desde la misma SDK. El m&eacute;todo se utiliza de la siguiente manera:
```nodejs
sdk.getStatus(options, merchant, operationId, callback);// Merchant es el id site y operationId es el id operación que se envió en el objeto a través del método sendAuthorizeRequest() 
```
El siguiente m&eacute;todo retornara el status actual de la transacci&oacute;n en Todopago.
[<sub>Volver a inicio</sub>](#inicio)		

<a name="statusdate"></a>
## Consulta de operaciones por rango de tiempo
En este caso hay que llamar a getByRangeDateTime() y devolvera todas las operaciones realizadas en el rango de fechas dado

```nodejs

	var parameters = {
		'MERCHANT': '2153',
		'STARTDATE': '2015-01-01T17:34:42.903',
		'ENDDATE': '2015-12-10T17:34:42.903'
	};
	
	sdk.getByRangeDateTime(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("GetByRangeDateTime");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
	

```

[<sub>Volver a inicio</sub>](#inicio)	

<a name="devoluciones"></a>
## Devoluciones

La SDK dispone de métodos para realizar la devolución online, total o parcial, de una transacción realziada a traves de TodoPago.

#### Devolución Total

Se debe llamar al método ```voidRequest``` de la siguiente manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'RequestKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.voidRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("VoidRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
```

También se puede llamar al método ```voidRequest``` de la esta otra manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'AuthorizationKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.voidRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("VoidRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});

#### Devolución Parcial

Se debe llamar al método ```returnRequest``` de la siguiente manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'RequestKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.returnRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("ReturnRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
```

También se puede llamar al método ```returnRequest``` de la esta otra manera:
```nodejs

	var parameters = {
		'Security': '108fc2b7c8a640f2bdd3ed505817ffde',
		'Merchant': '2669',
		'AuthorizationKey': '0d801e1c-e6b1-672c-b717-5ddbe5ab97d6',
		'AMOUNT': 1.00
	};
	
	sdk.returnRequest(options, parameters, function(result, err){
		console.log("-------------------***-------------------");
		console.log("ReturnRequest");
		console.log(result);
		console.log(err);
		console.log("-------------------***-------------------");
	});
```

[<sub>Volver a inicio</sub>](#inicio)	


<a name="secuencia"></a>
##Diagrama de secuencia
![imagen de configuracion](https://raw.githubusercontent.com/TodoPago/imagenes/master/README.img/secuencia-page-001.jpg)

<a name="tablas"></a>		
## Tablas de Referencia		
######[Códigos de Estado](#cde)		
######[Provincias](#p)		
<a name="cde"></a>		
<p>Codigos de Estado</p>		
<table>		
<tr><th>IdEstado</th><th>Descripción</th></tr>		
<tr><td>1</td><td>Ingresada</td></tr>		
<tr><td>2</td><td>A procesar</td></tr>		
<tr><td>3</td><td>Procesada</td></tr>		
<tr><td>4</td><td>Autorizada</td></tr>		
<tr><td>5</td><td>Rechazada</td></tr>		
<tr><td>6</td><td>Acreditada</td></tr>		
<tr><td>7</td><td>Anulada</td></tr>		
<tr><td>8</td><td>Anulación Confirmada</td></tr>		
<tr><td>9</td><td>Devuelta</td></tr>		
<tr><td>10</td><td>Devolución Confirmada</td></tr>		
<tr><td>11</td><td>Pre autorizada</td></tr>		
<tr><td>12</td><td>Vencida</td></tr>		
<tr><td>13</td><td>Acreditación no cerrada</td></tr>		
<tr><td>14</td><td>Autorizada *</td></tr>		
<tr><td>15</td><td>A reversar</td></tr>		
<tr><td>16</td><td>A registar en Visa</td></tr>		
<tr><td>17</td><td>Validación iniciada en Visa</td></tr>		
<tr><td>18</td><td>Enviada a validar en Visa</td></tr>		
<tr><td>19</td><td>Validada OK en Visa</td></tr>		
<tr><td>20</td><td>Recibido desde Visa</td></tr>		
<tr><td>21</td><td>Validada no OK en Visa</td></tr>		
<tr><td>22</td><td>Factura generada</td></tr>		
<tr><td>23</td><td>Factura no generada</td></tr>		
<tr><td>24</td><td>Rechazada no autenticada</td></tr>		
<tr><td>25</td><td>Rechazada datos inválidos</td></tr>		
<tr><td>28</td><td>A registrar en IdValidador</td></tr>		
<tr><td>29</td><td>Enviada a IdValidador</td></tr>		
<tr><td>32</td><td>Rechazada no validada</td></tr>		
<tr><td>38</td><td>Timeout de compra</td></tr>		
<tr><td>50</td><td>Ingresada Distribuida</td></tr>		
<tr><td>51</td><td>Rechazada por grupo</td></tr>		
<tr><td>52</td><td>Anulada por grupo</td></tr>		
</table>		
		
<a name="p"></a>		
<p>Provincias</p>
<p>Solo utilizado para incluir los datos de control de fraude</p>
<table>		
<tr><th>Provincia</th><th>Código</th></tr>		
<tr><td>CABA</td><td>C</td></tr>		
<tr><td>Buenos Aires</td><td>B</td></tr>		
<tr><td>Catamarca</td><td>K</td></tr>		
<tr><td>Chaco</td><td>H</td></tr>		
<tr><td>Chubut</td><td>U</td></tr>		
<tr><td>Córdoba</td><td>X</td></tr>		
<tr><td>Corrientes</td><td>W</td></tr>		
<tr><td>Entre Ríos</td><td>E</td></tr>		
<tr><td>Formosa</td><td>P</td></tr>		
<tr><td>Jujuy</td><td>Y</td></tr>		
<tr><td>La Pampa</td><td>L</td></tr>		
<tr><td>La Rioja</td><td>F</td></tr>		
<tr><td>Mendoza</td><td>M</td></tr>		
<tr><td>Misiones</td><td>N</td></tr>		
<tr><td>Neuquén</td><td>Q</td></tr>		
<tr><td>Río Negro</td><td>R</td></tr>		
<tr><td>Salta</td><td>A</td></tr>		
<tr><td>San Juan</td><td>J</td></tr>		
<tr><td>San Luis</td><td>D</td></tr>		
<tr><td>Santa Cruz</td><td>Z</td></tr>		
<tr><td>Santa Fe</td><td>S</td></tr>		
<tr><td>Santiago del Estero</td><td>G</td></tr>		
<tr><td>Tierra del Fuego</td><td>V</td></tr>		
<tr><td>Tucumán</td><td>T</td></tr>		
</table>		
[<sub>Volver a inicio</sub>](#inicio)
