import PostModel from '../models/Post.js'
import lodash from 'lodash'

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5);

    res.json(tags)
  } catch (err) {
    console.log(err)
    res.status(500).json({
        message: 'не удалось получить статьи'
    })
  }
};
export const sortByTag = async (req, res) => {
  try {
      const tagName = (req.params.name);
      const postsList = await PostModel.find({tags: tagName}).exec();
      res.json(postsList);
  } catch (err) {
      console.log(err)
      res.status(500).json({
          message: "не удалось получить статьи",
      })
  }
}

export const getAll = async (req, res) => {
  try {
      const posts = await PostModel.find().populate('user').exec();

      const sortPostByCreate = lodash.orderBy(posts, ['createdAt'], ['desc']);

      res.json(sortPostByCreate)
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'не удалось получить статьи'
      })
    }
};

export const getAllPopulate = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();

    const sortPostByViews = lodash.orderBy(posts, ['viewsCount'], ['desc']);

    res.json(sortPostByViews);
  } catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'не удалось получить статьи'
    })
  }
};

export const createComment = async (req, res) => {
  try {
      const postId = (req.params.id).trim();
      await PostModel.updateOne({_id: postId},  {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          tags: req.body.tags,
          comments: req.body.comments,
          
      })
      res.json({
          success: true,
      })
  } catch (err) {
      console.log(err)
      res.status(500).json({
          message: "не удалось создать комментарий",
      })
  }
};

export const getLastComments = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const comments = posts.map(obj => obj.comments).flat().slice(0, 5);

    return res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'не удалось получить статьи'
    })
  }
}

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete({
      _id: postId
    }).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "не удалось удалить статью",
        });
      }

      if (!doc) {
        return res.status(404).json({
          message: "статья не найдена",
        });
      }

      res.json(doc)
    })

} catch (err) {
  console.log(err);
  res.status(500).json({
    message: "ошибка",
  });
 }
};

export const getOne = async (req, res) => {
    try {
      const postId = req.params.id;
  
    PostModel.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { viewsCount: 1 },
    },
    {
      returnDocument: "after",
    }
    ).populate('user').then((doc, err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "не удалось вернуть статью",
      });
    }
    if (!doc) {
      return res.status(404).json({
        message: "статья не найдена",
      });
    }
    res.json(doc);
  });
} catch (err) {
  console.log(err);
  res.status(500).json({
    message: "ошибка",
    });
   }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'не удалось создать статью'
        })
    }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne({
      _id: postId
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      tags: req.body.tags.split(','),
    })

    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
        res.status(500).json({
            message: 'не удалось обновить статью'
        })
  }
}

