const controller = {};
const { Client } = require('pg');
require('dotenv').config();
const jwtdecode =  require("jwt-decode")  ;
//send mail with nodemailer and sendgrid(addon heroku)
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require('nodemailer-sendgrid');
//MercadoPago Config
const mercadopago = require("mercadopago");
mercadopago.configurations.setAccessToken(process.env.MP_ACCESS_TOKEN); 
// mercadopago.configurations.setAccessToken("TEST-4521124902880762-012905-88648c45db3245efd24137295865fde9-708170607");

const request = require("request");
const circularJSON = require('circular-json');

//Json Web Token Config
const jsonwebtoken = require('jsonwebtoken');

controller.handleNotification = async(req,res)=>{
        if (req){
          res.status(200).send("OK");
          console.log(req.body);
          let notidata = req.body;
          let id = req.body.data.id;
              const client = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: {
                  rejectUnauthorized: false
                }
              });
              client.connect();
              const results = await client.query("INSERT INTO paymentsmp (paymentid, request ) VALUES ($1,$2)",[id, notidata]);
              client.end();
              if(results){
                console.log("paymentmp created");
              }
              else{
                console.log("paymentmp error creating");
              }     
        }
       
}

controller.getPaymentsmp = (req,res)=>{
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
    client.query('SELECT * FROM paymentsmp;', (err, response) => {
      client.end();
        return res.json(response.rows);
      }); 
};

controller.getPaymentmp = async(req,res) => { 
  const paymentid = req.params.id;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  
  const results = await client.query('SELECT * FROM paymentsmp WHERE paymentid = $1',[paymentid]);
  client.end();
  let filtrado = results.rows.map((item)=>{
    item.url = "";
    return item;
  })
  return res.send(filtrado);
};

controller.welcome = (req,res)=>{
  res.json({message: "Welcome"});
};

controller.getJwt = (req,res)=>{
    let payload = { 
      id: req.body.itemId,
      email: req.body.email
    }
    let token = jsonwebtoken.sign({payload},process.env.MY_SECRET);
    res.json({
      token
    });
};

controller.getItems = async (req,res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  client.query('SELECT * FROM items;', (err, response) => {
    client.end();
    let filtrado = response.rows.map((item)=>{
      item.url="";
      return item;
    })
    // console.log("items filtrados enviados")
    return res.send(filtrado);
    //clien.end() here was the problem
  });
  // clien.end() here was the problem
};


controller.getItem = async(req,res) => { 
  const id = req.params.id;

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  
  const results = await client.query('SELECT * FROM items WHERE id = $1',[id]);
  client.end();
  let filtrado = results.rows.map((item)=>{
    item.url = "";
    return item;
  })
  return res.send(filtrado);

};

//solo le paso el token si es legal entonces saco el id del payload y retorno el item premium
controller.sendPremiumItem = async(req,res)=>{
  // console.log(req.token);
  jsonwebtoken.verify(req.token, process.env.MY_SECRET, async(err,data)=>{
      if(err){
        res.send("error verificando token");
      }
      else{
        let decoded = jwtdecode(req.token);
        const client = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false
          }
        });
        client.connect();
        try{
          const results = await client.query('SELECT * FROM items WHERE id = $1',[decoded.payload.id]);
          client.end();
          res.send({item:results.rows,email:decoded.payload.email}); 
        }
        catch(err){
          // console.log("error obteniendo item premium");
          res.send("error obteniendo item premium: "+err);
        }
      }
  })
 
}

controller.getPayments = (req,res)=>{
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  
    client.query('SELECT * FROM payments;', (err, response) => {
      client.end();
        return res.json(response);
      }); 
};


//devuleve el id al que pertenece el token si el mismo esta verificado
//solo envio el token en el header no hacen falta mas parametros ya que el token deberia incluir en su payload el id
controller.verifyPayment = async(req,res) => { 
  jsonwebtoken.verify(req.token, process.env.MY_SECRET,(err,data)=>{
      if(err){
        res.status(403).send("Token ilegal firma no verificada");
      }
      else{
        let decoded = jwtdecode(req.token);
        res.status(200).send(decoded.payload.id);
      }
  })

};

controller.createPayment = async(req,res) => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
  client.connect();
  const { email, itemId, date, token } = req.body;
  // console.log(email,itemId,date,token);
  const results = await client.query("INSERT INTO payments (email, itemid, date_created, token ) VALUES ($1,$2,$3,$4)",[email,parseInt(itemId),date,token]);
  client.end();
  if(results){
    return res.send(results);
  }
  else{
    return res.send("error query");
  }
};


controller.createPreference = (req,res)=>{
  let price = req.body.item.price;
  let name = req.body.item.name;
  let description = req.body.item.description;
  let itemId = req.body.item.itemId;
  let payer = req.body.payer;
  let url_sample = req.body.item.picture_url;
  let address = req.body.payer.address;

  let preference = {
		items: [{
			title: name,
			unit_price: price,
			quantity: 1,
      id:itemId,
      description:description,
      picture_url: url_sample
		}],
    payer: {
      name: payer.name,
      surname: payer.surname, 
      email: payer.email,
      phone: {
          area_code: payer.phone.area_code,
          number: payer.phone.number
      },
      address: {
          street_name: address.street_name,
          street_number: address.street_number,
          zip_code: address.zip_code
      }
  },
    external_reference:"sergiodavidposse@gmail.com",
		back_urls: {
			"success": "https://sergioposse-mp-commerce-nodejs.herokuapp.com/success/"+itemId,
			"failure": "https://sergioposse-mp-commerce-nodejs.herokuapp.com/failure/"+itemId,
			"pending": "https://sergioposse-mp-commerce-nodejs.herokuapp.com/pending/"+itemId
      // "success": "http://localhost:3000/success/"+itemId,
			// "failure": "http://localhost:3000/failure/"+itemId,
			// "pending": "http://localhost:3000/pending/"+itemId
		},
    notification_url: "https://mp-commerce-backend.herokuapp.com/api/notification?source_news=webhooks",
		auto_return: "approved",
    payment_methods: {
      excluded_payment_methods: [
          {
              "id": "amex"
          }
      ],
      excluded_payment_types: [
          {
              "id": "atm"
          }
      ],
      "installments": 6
  },
	};
  mercadopago.preferences.create(preference)
    .then(function (response) {
      console.log(response);
      res.json(response);
    }).catch(function (error) {
      console.log(error);
      res.send("Error: "+error);
  });
};

controller.getMercadoPagoInfo = (req,res)=>{
  var headers = {
    'Authorization': 'Bearer '+process.env.MP_ACCESS_TOKEN
    // 'Authorization': 'Bearer '+'TEST-4521124902880762-012905-88648c45db3245efd24137295865fde9-708170607'
  };
  var options = {
    url: 'https://api.mercadopago.com/v1/payments/'+req.body.paymentId,
    method: 'GET',
    headers: headers
  };

  request(options, function (err, response, body) {
    if (err) {
       res.send(err);
       console.log(err);
    }
    else{
       res.send(JSON.parse(body));
    }
  });
}
controller.sendEmail = (req,res)=>{
  const { email, link } = req.body;

  const client = nodemailer.createTransport(
      nodemailerSendgrid({
        host: process.env.SMTP, // smtp.sendgrid.net
        pool: true,
        maxConnections: 20,
        rateDelta: 1000,
        rateLimit: 150,
        apiKey: process.env.SENDGRID_APIKEY     
      })
  );
  //must set an apikey manually from the sendgrid cpanel and not use the default SENDGRID_USER,SENDGRID_PASSWORD
  //that heroku creates when add the sendgrid as addon to your app

   var configemail = {
    from: process.env.MAIL,
    to: email,
    subject: 'agustinacarrizo',
    text: link
    };

    client.sendMail(configemail, function(err, info){
      if (err ){
        console.log(err);
        return res.send("error");
      }
      else {
        console.log('Message sent: ' + info);
        return res.send(info);
      }

    });
  }

module.exports = controller;