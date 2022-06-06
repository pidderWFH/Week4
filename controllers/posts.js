const serviceHandle = require("../service/handle");
const Post = require("../model/posts");
const User = require("../model/users");

const posts = {
    // async getAllPosts(req, res){
    //     const allPost = await Post.find();
    //     serviceHandle.handleSucess(res, allPost);
    // },
    async getAllPosts(req, res){
        const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
        const allPost = await Post.find(q).populate({
            path: 'user',
            select: 'name photo '
        }).sort(timeSort);
        // asc 遞增(由小到大，由舊到新) createdAt ; 
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        serviceHandle.handleSucess(res, allPost);
    },
    async createdPosts(req, res){
        try{
            // const data = JSON.parse(body); express已經有做了
            const { body } = req;
            const user = await User.findById(body.user).exec();
            if(!user) {
                return serviceHandle.handleError(res, errCode=4001, "無此使用者");
            }else {
                if(!body.content){
                    serviceHandle.handleError(res, errCode=4002, "欄位不能空白");
                }else{
                    const newPost = await Post.create(
                        {
                            user: body.user,
                            content: body.content,
                            image: body.image,
                            tags: body.tags,
                            type: body.type
                        },
                    );
                    serviceHandle.handleSucess(res, newPost)
                }
            }
        }catch( err ){
            
            serviceHandle.handleError(res, 400, err.message);
        }
    },
    async deleteAllPosts(req, res){
        const posts = await Post.deleteMany({});
        serviceHandle.handleSucess(res, posts);
    },
    async deleteOnePosts(req, res){
        try {
            // const id = req.url.split('/').pop();
            const id = req.params.id;
            deleteOne = await Post.findByIdAndDelete(id);
    
            if (deleteOne){
                const post = await Post.find();
                serviceHandle.handleSucess(res, post);
            }else{
                serviceHandle.handleError(res, 4003, "無此使用者貼文")
            }
        } catch (err) {
            serviceHandle.handleError(res, 400, err.message)
        }
    },
    async patchPosts(req, res){
        try {
            const id = req.params.id;
            const { body } = req;
            let { name, content, tags, type, likes } = body;
            // const opts = { runValidators: true };
            const patchPost = await Post.findByIdAndUpdate(id, { $set: {name, content, tags, type, likes}}, { runValidators: true, returnDocument: 'after' });


            if (!body.content){
                return serviceHandle.handleError(res, 4002, "欄位不能空白");
            }

            if (patchPost === null){
                return serviceHandle.handleError(res, 4001, "無此使用者");
            }else {
                // const post = await Post.findOne({ _id: id });
                serviceHandle.handleSucess(res, patchPost);
            } 
        } catch (err) {
            serviceHandle.handleError(res, 400, err.message);
        }
    },
}

module.exports = posts;