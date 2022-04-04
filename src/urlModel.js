// { urlCode: { mandatory, unique, lowercase, trim }, longUrl: {mandatory, valid url}, shortUrl: {mandatory, unique} }
const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode : {type : String,
        required :true,
        trim : true,
        unique : true,
        lowercase : true
    },
        longUrl : {
            type :String,
            required: true
            // valid

        },
        shortUrl:{
            type: String,
            required : true,
            unique : true,
        },
        
    },
    
 { timestamps: true });
module.exports=mongoose.model('url',urlSchema)