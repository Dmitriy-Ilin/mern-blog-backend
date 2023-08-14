import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors'
import { registerValidation, loginValidation, postCreateValidation, commentCreateValidation } from './validation.js';
import { handleValidationErrors, checkAuth } from './utils/index.js'
import { UserController, PostController, CommentController } from './controllers/index.js'
import { getLastTags } from './controllers/PostController.js';


mongoose.connect(
    'mongodb+srv://admin:admin12345@cluster0.fo2lzbl.mongodb.net/blog?retryWrites=true&w=majority'
    ).then(() => console.log('db ok'))
    .catch((err) => console.log('db error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({storage});

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
// app.get('/comments', CommentController.getAll);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.get('/comments', PostController.getLastComments);
app.post('/comments/:id', checkAuth, PostController.createComment);

app.get('/tags', PostController.getLastTags)
app.get('/tags/:name', PostController.sortByTag);
app.get('/posts', PostController.getAll);
app.get('/posts/popular', PostController.getAllPopulate);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server ok');
})

