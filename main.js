//Node js server
//This code will power the backend of my website
// I will need express js for handling input/output
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log("Serving on port:",PORT)
})





app.post('/login', (req, res, next)=>{
    const LogInData = JSON.parse(req.body);
    

})