const request = require('request-promise')
const parse = require('xml2js').parseString

const email = 'erickvictor@gmail.com'
const token = '50F0C4FDA2774176A5A0ED050334D8DA'


/*
// checkout
request({
  uri: 'https://ws.sandbox.pagseguro.uol.com.br/v2/checkout',
  method: 'POST',
  form: {
    token: token,
    email: email,
    currency: 'BRL',
    itemId1: 'idCampanha',
    itemDescription1: 'Doação',
    itemQuantity1: '1',
    itemAmount1: '2.00',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  }
})
.then( data => {
  parse(data, (err, json) => {
    console.log(json.checkout.code[0])
  })
})*/
//https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code=


// Notification
const notificationCode = '16'
const consultaNotificacao = 'https://ws.pagseguro.uol.com.br/v3/transactions/notifications'
request(consultaNotificacao+notificationCode+'?token='+token+'&email='+email)
.then( notificationXML => {
  parse(notificationXML, (err, transactionJson) => {
    const transaction = transactionJson.transaction
    const status = transaction.status[0]
    const amount = transaction.grossAmount[0]
    const campanha = transaction.items[0].item[0].id[0]
    console.log(transaction.transaction)
  })
})
