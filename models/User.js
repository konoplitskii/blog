import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    passwordHash: {
        type:String,
        required:true
    },
    avatarUrl:String,
},{
    // таким способом прикручиваем при создании юзера дату
    timestamps:true,
});


export default mongoose.model('User',userSchema);