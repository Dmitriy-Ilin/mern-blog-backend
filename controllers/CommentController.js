import CommentModel from '../models/Comment.js'

export const getAll = async (req, res) => {
    try {
        const comments = await CommentModel.find().populate('user').exec();

        res.json(comments);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось вернуть комментарий'
        })
    }
};

export const create = async (req, res) => {
    try {
        const doc = new CommentModel({
            text: req.body.text,
            user: req.userId
        });

        const comment = await doc.save();

        res.json(comment);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'не удалось создать комментарий'
        })
    }
}