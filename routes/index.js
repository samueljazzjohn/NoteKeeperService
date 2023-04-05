var express = require('express');
var router = express.Router();

router.get('/',async(req,res,next)=>{
    res.send("hello express")
  })

module.exports = router;