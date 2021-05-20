const { Router } = require('express');
const router = Router();
const { 
  handleNotification,
  welcome,
  getItems,
  getItem,
  sendPremiumItem,
  createPreference,
  getMercadoPagoInfo,
  getJwt,
  createPayment,
  getPayments,
  getPaymentmp,
  getPaymentsmp,
  sendEmail,
  verifyPayment } = require('../controllers/index');

  // var corsOptions = {
  //   origin: 'https://agustinacarrizo.herokuapp.com',
  //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  // }

const ensureToken = (req,res,next)=>{
  if(req.headers['authorization']){
      let bearerHeader = req.headers['authorization'];
      let bearer = bearerHeader.split(" ");
      let bearerToken = bearer[1];
      req.token = bearerToken;
      next();
  }
  else{
    res.send("FALLO bearerHeader");//forbbiden/no permitido
  }
};
router.get('/api/paymentsmp',getPaymentsmp); //funciono porque lo movi arriba
router.get('/api/payments',getPayments); //funciono porque lo movi arriba
router.post('/api/payment',ensureToken, verifyPayment); //funciono porque lo movi arriba
router.get('/',welcome);
router.get('/api',getItems);
router.get('/api/:id',getItem);
router.get('/api/paymentsmp/:id',getPaymentmp);
router.post('/api/createpayment',createPayment);
router.post('/api/create_preference',createPreference);
router.post('/api/sendpremiumitem',ensureToken,sendPremiumItem);
router.post('/api/mpinfo', getMercadoPagoInfo)
router.post('/api/jwt', getJwt);
router.post('/api/notification',handleNotification);
router.post('/api/sendemail',sendEmail);

router.get('/api/feedback',function(request, response) {
  response.json({
   Payment: request.query.payment_id,
   Status: request.query.status,
   MerchantOrder: request.query.merchant_order_id
 })

});

module.exports = router;