import { body } from "express-validator";

export const loginValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min:5}),
]

export const registerValidation = [
    body('email','Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min:5}),
    body('fullName', 'Имя должно содержать минимум 3 символа').isLength({min:3}),
    body('avatarUrl','Указали не верную ссылку').optional().isURL(),
]

export const postCreateValidation = [
    body('title','Введите заголовок статьи').isLength({min:3}).isString(),
    body('text', 'Введите текст').isLength({min:10}).isString(),
    body('tags', 'Неверный формат тэгов').optional().isArray(),
    body('imageUrl','Указали не верную ссылку').optional().isString(),
]