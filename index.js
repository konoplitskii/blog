import express from 'express';
import mongoose from 'mongoose';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import {loginValidation, postCreateValidation, registerValidation} from "./validations.js";


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


app.post('/auth/login',loginValidation, UserController.login);
app.post('/auth/register',registerValidation,UserController.register);
//получаем информацию о пользователе
app.get('/auth/me',checkAuth,UserController.getMe);

app.get('/post',PostController.getAll);
app.get('/post/:id',PostController.getOne);

app.post('/post',checkAuth, postCreateValidation ,PostController.create);
app.delete('/post/:id',checkAuth,PostController.remove);
app.patch('/post/:id',checkAuth,PostController.update);

app.listen(4444,(err)=> {
    if(err) {
        console.log(err)
    }
    console.log('Server start')
});
