const mongoose=require('mongoose')

//1-Create Schema

const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Category is Required'],
        unique:[true,'Category must be unique'],
        minLength:[3,'Too short name category name'],
        maxLength:[32,'Too long name category name'],
    },
    slug:{
        type:String,
        lowercase:true,
    },
    image:String,

}, {timestamps:true});

//2-Create Model

const CategoryModel=mongoose.model('Category',categorySchema);

module.exports=CategoryModel;