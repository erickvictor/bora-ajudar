const functions = require('firebase-functions')
const admin = require('firebase-admin')

const express = require('express')
const bodyParser = require('body-parser')
const app = express()

admin.initializeApp(functions.config().firebase)
//admin.initializeApp()

const request = require('request-promise')
const parse = require('xml2js').parseString

const email = 'erickvictor@gmail.com'
const token = '50F0C4FDA2774176A5A0ED050334D8DA'
const checkoutUrl = 'https://sandbox.pagseguro.uol.com.br/v2/checkout/payment.html?code='

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const campanha = '-L9L3jGNEb1k_dRwdZBb'
  const amount = '4.00'
  admin
    .database()
    .ref('/campanhas/'+campanha)
    .once('value')
    .then(value => {
      const campanhaAtual = value.val()
      const doado = parseFloat(campanhaAtual.doado) + parseFloat(amount)
      campanhaAtual.doado = doado.toFixed(2)
      admin
        .database()
        .ref('/campanhas/'+campanha)
        .set(campanhaAtual)
        .then(() => {
          res.send(campanhaAtual)
        })
    })
  //res.send('BoraAjudar Server')
})
app.post('/donate', (req, res) => {
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
      res.send({
        url: checkoutUrl+json.checkout.code[0]
      })
    })
  })
})

app.post('/webhook', (req, res) => {
  const notificationCode = req.body.notificationCode
  const consultaNotificacao = 'https://ws.pagseguro.uol.com.br/v3/transactions/notifications'
  request(consultaNotificacao+notificationCode+'?token='+token+'&email='+email)
  .then( notificationXML => {
    parse(notificationXML, (err, transactionJson) => {
      const transaction = transactionJson.transaction
      const status = transaction.status[0]
      const amount = transaction.grossAmount[0]
      const campanha = transaction.items[0].item[0].id[0]

      //atualizando a campanha
      admin
        .database()
        .ref('/campanhas/'+campanha)
        .once('value')
        .then(value => {
          const campanhaAtual = value.val()
          const doado = parseFloat(campanhaAtual.doado) + parseFloat(amount)
          campanhaAtual.doado = doado.toFixed(2)
          admin
            .database()
            .ref('/campanhas/'+campanha)
            .set(campanhaAtual)
            .then(() => {
              res.send('ok')
            })
      })

      //salvando a transacao
      admin
        .database()
        .ref('/transactions/'+transaction.code[0])
        .set(transaction)
        .then(() => {
          
        })


      
    })
  })
})

exports.api = functions.https.onRequest(app)
