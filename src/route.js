const express = require('express')
const router = express.Router()


const urlController = require('./urlController')



router.post('/url/shorten', urlController.createUrl)

router.get('/:urlCode', urlController.getOriginalUrl)

module.exports=router