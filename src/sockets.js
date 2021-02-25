const Comment = require('./models/Comment.model');
const uuid = require('uuid');
let socketGlobal;

const getSocket = () => socketGlobal;

module.exports = [
  (io) => {
    io.on('connection', async (socket) => {
      socketGlobal = socket;
      // console.log(socket.id);
      // console.log(' %s sockets connected', io.engine.clientsCount);
      socket.on('getId', (id) => {
        socket.videoId = id;
        socket.join(id);
      });

      socket.on('getUser', (id) => {
        socket.userId = id;
        socket.join(id);
      });

      socket.on('getLocalId', (id) => {
        socket.localId = id;
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
      socket.on('addListMe', function(data) {
        socket.to(socket.userId).emit('addListMe', data);
      });
      socket.on('logoutMe', function() {
        socket.to(socket.userId).emit('logoutMe');
      });
      socket.on('loginMe', function(data) {
        socket.to(socket.localId).emit('loginMe', data);
      });
      socket.on('loginMeRedirect', function() {
        socket.to(socket.localId).emit('loginMeRedirect');
      });
      socket.on('updateLikeMe', function(data) {
        socket.to(socket.userId).emit('updateLikeMe', data);
      });
      socket.on('updateDislikeMe', function(data) {
        socket.to(socket.userId).emit('updateDislikeMe', data);
      });
      socket.on('updateLikeCommentMe', function(data) {
        socket.to(socket.userId).emit('updateLikeCommentMe', data);
      });
      socket.on('updateDislikeCommentMe', function(data) {
        socket.to(socket.userId).emit('updateDislikeCommentMe', data);
      });
      socket.on('updateSubLikeCommentMe', function(data) {
        socket.to(socket.userId).emit('updateSubLikeCommentMe', data);
      });
      socket.on('updateSubDislikeCommentMe', function(data) {
        socket.to(socket.userId).emit('updateSubDislikeCommentMe', data);
      });
    }); 
  }, 
  getSocket
];