const express = require('express')
const app = express()
var cors = require('cors')
const port = 3000
app.use(cors())
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.post('/verifyOnLedger', async (req, res) => {
    console.log("chirag");

    // let i;
    // for(i = 0; i < 10; i++){
    //
    // }
    req.body.data.forEach((rowObj) => {
         console.log(rowObj.ecid)
        // console.log(JSON.stringify(rowObj));
    });

    res.send(req.body.data)
});

app.post('/getChallenge', async (req, res) => {
    console.log("chirag");

    // let i;
    // for(i = 0; i < 10; i++){
    //
    // }
    req.body.data.forEach((rowObj) => {
        // console.log(rowObj.serialNumber)
        // console.log(JSON.stringify(rowObj));
    });
    // res.send('Hello World!')
    res.send(req.body.data)
});

app.post('/sellAsset', async (req, res) => {
    // console.log(JSON.stringify(req.body.data));
    console.log(JSON.stringify(req.body.newOwnerName));
    req.body.data.forEach((rowObj) => {
        console.log(JSON.stringify(rowObj));
    });
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})