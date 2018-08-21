//--------------Requirements-------------//

require('dotenv').config();
const express = require('express')
    , session = require('express-session')
    , massive = require('massive')
    , bodyParser = require('body-parser')
    , checkUserSession = require('./middleware/checkUserSession')
    , ctrl = require('./controller')
    , cors = require('cors');
const app = express();

//--------------DotEnv----------//

const {
    SERVER_PORT,
    SESSION_SECRET,

} = process.env;

//--------------Middleware-------------//

app.use(express.static(`${__dirname}/../build`));

app.use(cors());

app.use(bodyParser.json());

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
});

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(checkUserSession);

//--------------Endpoints-------------//

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/../public/index.html');
});

//--------------NodeMailer-------------//

app.post('/send/email', function(req, res, next){
    let {user, message, emailSubject} = req.body;
    const transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: APP_ADDRESS,
        pass: APP_PASSWORD
      }
    }));
    const mailOptions = {
      from: `${user.email}`,
      to: APP_ADDRESS,
      subject: `${emailSubject}`,
      text: `${message}`,
      replyTo: `${user.email}`
    }
    transporter.sendMail(mailOptions, function(err, res) {
      if (err) {
        console.error('there was an error: ', err);
      } else {
        console.log('here is the res: ', res)
      }
    })
});

//--------------Listening-------------//

app.listen(SERVER_PORT, () => {
    console.log(`Listening on port: ${SERVER_PORT}`)
});
