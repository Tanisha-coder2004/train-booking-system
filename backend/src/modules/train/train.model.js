import mongoose, { Mongoose } from "mongoose";
const trainSchema = new mongoose.Schema({
    id:{
        type:String
    },
    number:{
        type:String
    },
    name:{
        type:String
    },
    src:{
        type:String
    },
    dest:{
        type:String
    },
    departure:{
       type:String
    },
    arrival:{
        type:String
    },
    duration:{
        type:String
    },
    date:{
        type:String
    },
    inventory:{
        type:Map,
        of:new Mongoose.Schema({
            available:{type:Number , default:0},
            price:{type:Number}
        },{_id:false})
    }
})

export const Train = mongoose.model("Train",trainSchema)