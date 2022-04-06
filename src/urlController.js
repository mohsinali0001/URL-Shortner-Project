const urlModel = require("./urlModel")
var validUrl = require('valid-url');
const shortid = require('shortid')



let isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}



const baseUrl =  'http://localhost:3000'


let createUrl = async function (req, res) {
    try {
        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Enter valid Parameters" })
        }

        if (!validUrl.isUri(baseUrl)) {
            return res.status(400).send({ status: false, message: "Invalid base URL" })
        }

        const { longUrl } = requestBody

        if (!longUrl) { return res.status(400).send({ status: false, message: "LongUrl required" }) }

        if (!(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(longUrl))) {
            return res.status(400).send({ status: false, message: "Invalid LongURL" })
        }
        if (!(/^\S*$/.test(longUrl))) {
            return res.status(400).send({ status: false, message: "Not a valid LongURL" })
        }
        
        let UrlData = await urlModel.findOne({ longUrl:longUrl})
        if (UrlData) {
            return res.status(200).send({ status: true, data: { longUrl: UrlData.longUrl, shortUrl: UrlData.shortUrl, urlCode: UrlData.urlCode } })
        }
        
        const urlCode = shortid.generate()

        let urlcode = await urlModel.findOne({ urlCode: urlCode })
        if (urlcode) {
            return res.status(400).send({ status: false, message: "urlCode already exist,Create unique UrlCode" })
        }
        
        const shortUrl = baseUrl + '/' + urlCode

        let shorturl = await urlModel.findOne({ shortUrl: shortUrl })
        if (shorturl) {
            return res.status(400).send({ status: false, message: "ShortUrl already exist,Create unique shorturl" })
        }
        
        let urlData = {
            longUrl,
            shortUrl,
            urlCode
        }

        let data = await urlModel.create(urlData)
        return res.status(201).send({ status: true, data: { longUrl: data.longUrl, shortUrl: data.shortUrl, urlCode: data.urlCode } })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



let getOriginalUrl = async function (req, res) {
    try {

        let urlCodeNew = req.params.urlCode

        if (!urlCodeNew) { return res.status(400).send({ status: false, message: "urlCode Required" }) }

        let findUrlCode = await urlModel.findOne({ urlCode:urlCodeNew })
        if (!findUrlCode) { return res.status(400).send({ status: false, message: "urlCode not found" }) }


        return res.status(302).redirect( findUrlCode.longUrl )
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createUrl = createUrl
module.exports.getOriginalUrl = getOriginalUrl