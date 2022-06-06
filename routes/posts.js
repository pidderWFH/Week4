var express = require('express');
var router = express.Router();
const PostsControllers = require("../controllers/posts");

router.get('/posts', PostsControllers.getAllPosts);


router.post('/post', PostsControllers.createdPosts);

router.delete('/posts', PostsControllers.deleteAllPosts);

router.delete('/post/:id', PostsControllers.deleteOnePosts);

router.patch('/post/:id', PostsControllers.patchPosts);
module.exports = router;
