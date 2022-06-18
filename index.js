import express from 'express';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {registerValidation} from './validation/auth.js'
import {validationResult} from 'express-validator';
import userModal from  './models/User.js';


mongoose.connect('mongodb://localhost:27017/archblog')
.then(()=> {
  console.log('connect DB')  
})
.catch(()=> {
    console.log('DB error')
})

const app = express();

// express не понимает формат json, мы должны его научить)
// позволит читать json который будет приходить в запросах

app.use(express.json());


// req - это то, что прислал клиент
// res - это ответ 

// app.get('/', (req,res) => {
//     res.send('Hello world!')
// });


app.post('/auth/register',registerValidation, async (req,res)=> {
   try {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors.array())
    }

    const password = req.body.password;
    // алгоритм шифровки пароля
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModal({
        email:req.body.email,
        fullName:req.body.fullName,
        avatarUrl:req.body.avatarUrl,
        passwordHash : hash,
    });

    // создаём пользователя в mongo DB
    const user = await doc.save();

    // создаём токен

    const token = Jwt.sign({
        _id:user._id,
    },
        'secret123',
    {
        expiresIn: '30d'
    } 
    );

    const {passwordHash, ...userData} = user._doc

    res.json({
        ...userData,
        token
    });

   } catch (error) {
    console.error('error',error)
    res.status(500).json({
        message:'Не удалось зарегистрироваться'
    })
   }
});


app.listen(4444,(err)=> {
    if(err) {
        console.log(err)
    }

    console.log('Server start')
});