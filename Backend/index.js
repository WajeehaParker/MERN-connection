const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routers/employee-routes');
const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/', employeeRoutes);

app.listen(4000,()=>{
    console.log("server runing on port 4000");
})