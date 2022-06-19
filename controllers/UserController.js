import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import userModel from "../models/User.js";


export const register =  async (req,res)=> {
    try {
        const password = req.body.password;
        // алгоритм шифровки пароля
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new userModel({
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
}
export const login = async (req, res) => {
    try {
        //  Находим пользователя
        const user = await userModel.findOne({
            email: req.body.email
        });
        if (!user) {
            //если пользователь по email не найден
            return res.status(400).json({
                message: 'Пользователь не найден'
            });
        }

        //сравниваем два пороля
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            });
        }

        const token = Jwt.sign({
                _id: user._id,
            },
            'secret123', {
                expiresIn: '30d'
            }
        );

        const {passwordHash, ...userData} = user._doc

        res.json({
            ...userData,
            token
        });


    } catch (e) {
        res.status(500).json({
            message:'Не удалось авторизоватся'
        })
    }
}
export const getMe =  async (req,res)=> {
    try {
        //    Находим пользователя
        const user = await userModel.findById(req.userId)
        if(!user) {
            return res.status(404).json({
                message: "Пользователь не найден"
            })
        }
        const {passwordHash, ...userData} = user._doc
        res.json(userData);
    }catch (e) {
        console.log(e)
    }
}