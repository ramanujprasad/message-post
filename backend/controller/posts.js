const Post = require('../models/post');
exports.createPost = (req, res, next) => {
  const url =  req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creater: req.userData.userId
  });
  post.save().then(createPost => {
    res.status(201).json({
      message: 'Post added successfully!',
      post: {
        id: createPost._id,
        title: createPost.title,
        content: createPost.content,
        imagePath: createPost.imagePath
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating the post failed!'
    })
  });
};
 exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creater: req.userData.userId
  })
  Post.updateOne({_id: req.params.id, creater: req.userData.userId}, post).then((result) => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Updated post successfully!'
      })
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Could not update the post'
    })
  })
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
    creater: req.userData.userId
  }).then((result) => {
    if (result.n > 0) {
      res.status(200).json({
        message: 'Deleted post successfully!'
      })
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Deleting post falied'
    })
  })
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Fetching posts failed'
      })
    })
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({
        message: 'page not found'
      })
    }
  })
  .catch(error => {
    res.status(500).json({
      message: 'Fetching post failed'
    })
  })
};
