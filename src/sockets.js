const Comment = require('./models/Comment.model');
const uuid = require('uuid');

module.exports = [
  (io) => {
    io.on('connection', async (socket) => {
      // console.log(socket.id);
      socket.on('getId', (id) => {
        socket.videoId = id;
        socket.join(id);
      });

      socket.on('getUser', (id) => {
        socket.userId = id;
        socket.join(id);
      });

      socket.on('sendComment', async (data) => {
        // console.log(data,socket.videoId);
        let newComment = await Comment.create(data);
        io.to(socket.videoId).emit('getComment', newComment);
        // socket.emit('getComment', data);
      });
      socket.on('likeVideoUpdate', async (data) => {
        io.to(socket.videoId).emit('getLikesVideo', data);
      });
      socket.on('likeUpdate', async (data) => {
        io.to(socket.videoId).emit('getLikes', data);
      });
      socket.on('sublikeUpdate', async (data) => {
        io.to(socket.videoId).emit('getsubLikes', data);
      });
      socket.on('subComments', async (data) => {
        let _id = data.id;
        const comment = await Comment.findOne({_id});
        data.subId = uuid.v4();
        if(comment) {
          comment.subcomments.push({
            id: data.id,
            subId: data.subId,
            name: data.name,
            comment: data.comment,
            foto: data.foto,
            timestamp: data.timestamp,
            likes: data.likes,
            dislikes: data.dislikes,
            destino: data.destino
          });
          let newComment = await comment.save();
          io.to(socket.videoId).emit('getSubComments', data);
        } else {

        }
      });
      socket.on('deleteListWatch', function(data) {
        socket.to(socket.userId).emit('getNewList', data);
      });
    }); 
  }
];