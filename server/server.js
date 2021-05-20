const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
// const path = require('path');



app.use(cors(), function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
// app.disable('etag');

// app.use(express.static(path.join(__dirname, 'client/build')));

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(require(`./routes/index`));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`)
});