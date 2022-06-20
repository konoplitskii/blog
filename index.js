import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';
import checkAuth from './utils/checkAuth.js';
import { PostController,UserController} from './controllers/index.js';
import {loginValidation, postCreateValidation, registerValidation} from "./validations.js";
import handleValidationErrors from './utils/handleValidationErrors.js';


mongoose.connect('mongodb://localhost:27017/archblog')
.then(()=> {
  console.log('connect DB')  
})
.catch(()=> {
    console.log('DB error')
})


// создадим хранилище где мы будем сохранять картинки

const storage = multer.diskStorage({
    destination:(_,__,cb)=> {
        cb(null,'uploads')
    },
    filename:(_,file,cb)=> {
        cb(null,file.originalname)
    },
})


const upload = multer({storage});


const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads'))


app.post('/auth/login',loginValidation ,handleValidationErrors, UserController.login);
app.post('/auth/register',registerValidation ,handleValidationErrors,UserController.register);


app.get('/posts',PostController.getAll);
app.get('/post/:id',PostController.getOne);

app.get('/tags',PostController.getLastTags);



app.post('/upload',checkAuth, upload.single('image'), (req,res)=> {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.post('/post',checkAuth, postCreateValidation,handleValidationErrors ,PostController.create);
app.delete('/post/:id',checkAuth,PostController.remove);
app.patch('/post/:id',checkAuth,postCreateValidation,handleValidationErrors,PostController.update);
app.get('/auth/me',checkAuth,UserController.getMe);

app.listen(4444,(err)=> {
    if(err) {
        console.log(err)
    }
    console.log('Server start')
});

