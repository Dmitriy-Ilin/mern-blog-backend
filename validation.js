import { body } from "express-validator";

export const loginValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен иметь минимум 5 символов').isLength({min: 5}),

];

export const registerValidation = [
    body('email', 'неверный формат почты').isEmail(),
    body('password', 'пароль должен иметь минимум 5 символов').isLength({min: 5}),
    body('fullName', 'укажите имя').isLength({min: 3}),
    body('avatarUrl', 'неверная ссылка').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'введите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'неверный формат тегов (укажите массив)').optional(),
    body('imageUrl', 'неверная ссылка на изображение').optional().isString(),
];

export const commentCreateValidation = [
    body('text', 'комментарий должен иметь минимум 3 символа').isLength({min: 3}).isString()
];