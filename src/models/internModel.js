const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({

    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:[/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address'],
        trim:true,
        lowercase:true

    },
    
    
    mobile:{

     type:Number,
     required:true,
     unique:true,
     match: [/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/, 'Please provide a valid 10 digit Mobile Number'],
     trim:true

    },

    collegeId:{
        type: ObjectId,
        ref : "College",
        required:true


    },
    isDeleted:{
        type:Boolean,
        default:false
    }

},{ timestamps: true })

module.exports= mongoose.model('Intern', internSchema)