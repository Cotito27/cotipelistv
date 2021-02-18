const ctrl = {};
const Comment = require('../models/Comment.model');

function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

ctrl.index = async (req, res) => {
  let videoId = req.params.id;
  let perPage = 8;
  let page = parseInt(req.query.page) || 1;
  console.log(videoId, page);
  const comments = await Comment.find({ video_id: videoId }).skip((perPage * page) - perPage).limit(perPage).sort("-timestamp").lean();
  const nextComments = await Comment.find({ video_id: videoId }).skip((perPage * (parseInt(page) + 1)) - perPage).limit(perPage).sort("-timestamp").lean();
  let moreComments;

  if(nextComments.length >= 1) {
    moreComments = true;
  } else {
    moreComments = false;
  }
  // console.log(nextComments);
  res.json({
    comments,
    moreComments,
    page
  });
}

ctrl.like = async (req, res) => {
  let _id = req.params.id;
  let user_id = req.query.user_id;
  // console.log(user_id);
  // console.log(_id);
  const comment = await Comment.findOne({_id});
  // console.log(comment)
  if (comment) {
    let verifyRepeatLikes = comment.likes.includes(user_id);
    let verifyRepeatDislikes = comment.dislikes.includes(user_id);
    if(verifyRepeatDislikes) {
      let indexUserR = comment.dislikes.indexOf(user_id);
      comment.dislikes.splice(indexUserR, 1);
    } 
    if(verifyRepeatLikes) {
      let indexUserR = comment.likes.indexOf(user_id);
      comment.likes.splice(indexUserR, 1);
    } else {
      comment.likes.push(user_id);
    }
    // comment.likes = {
    //   count: comment.likes.count + 1,
    //   user_id
    // };
    await comment.save();
    res.json({likes: comment.likes, dislikes: comment.dislikes})
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
}

ctrl.dislike = async (req, res) => {
  let _id = req.params.id;
  let user_id = req.query.user_id;
  // console.log(user_id);
  // console.log(_id);
  const comment = await Comment.findOne({_id});
  // console.log(comment)
  if (comment) {
    let verifyRepeatLikes = comment.likes.includes(user_id);
    let verifyRepeatDislikes = comment.dislikes.includes(user_id);
    if(verifyRepeatLikes) {
      let indexUserR = comment.likes.indexOf(user_id);
      comment.likes.splice(indexUserR, 1);
    }
    if(verifyRepeatDislikes) {
      let indexUserR = comment.dislikes.indexOf(user_id);
      comment.dislikes.splice(indexUserR, 1);
    } else {
      comment.dislikes.push(user_id);
    }
    await comment.save();
    res.json({dislikes: comment.dislikes, likes: comment.likes})
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
}

ctrl.sublike = async (req, res) => {
  let _id = req.params.id;
  let user_id = req.query.user_id;
  let subId = req.query.subId;
  // console.log(user_id);
  // console.log(_id);
  let newLikes = [];
  let newDislikes = [];
  const comment = await Comment.findOne({_id});
  // console.log(comment)
  if (comment) {
    comment.subcomments.forEach((item) => {
      if(item.subId == subId) {
        let verifyRepeatLikes = item.likes.includes(user_id);
        let verifyRepeatDislikes = item.dislikes.includes(user_id);
        if(verifyRepeatDislikes) {
          let indexUserR = item.dislikes.indexOf(user_id);
          item.dislikes.splice(indexUserR, 1);
        } 
        if(verifyRepeatLikes) {
          let indexUserR = item.likes.indexOf(user_id);
          item.likes.splice(indexUserR, 1);
        } else {
          item.likes.push(user_id);
        }
        newLikes = item.likes;
        newDislikes = item.dislikes;
      }
    });
    // console.log('--------------------');
    let newData = await Comment.findOneAndUpdate({_id}, {$set: comment});
    //, {new: true}
    // let newData = await comment.save();
    res.json({likes: newLikes, dislikes: newDislikes});
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
}

ctrl.subdislike = async (req, res) => {
  let _id = req.params.id;
  let user_id = req.query.user_id;
  let subId = req.query.subId;
  // console.log(user_id);
  // console.log(_id);
  const comment = await Comment.findOne({_id});
  // console.log(comment)
  let newLikes = [];
  let newDislikes = [];
  if (comment) {
    comment.subcomments.forEach((item) => {
      if(item.subId == subId) {
        let verifyRepeatLikes = item.likes.includes(user_id);
        let verifyRepeatDislikes = item.dislikes.includes(user_id);
        if(verifyRepeatLikes) {
          let indexUserR = item.likes.indexOf(user_id);
          item.likes.splice(indexUserR, 1);
        }
        if(verifyRepeatDislikes) {
          let indexUserR = item.dislikes.indexOf(user_id);
          item.dislikes.splice(indexUserR, 1);
        } else {
          item.dislikes.push(user_id);
        }
        newLikes = item.likes;
        newDislikes = item.dislikes;
        console.log(item.likes, item.dislikes);
      }
    });
    let newData = await Comment.findOneAndUpdate({_id}, {$set: comment});
    res.json({dislikes: newDislikes, likes: newLikes})
  } else {
    res.status(500).json({error: 'Internal Error'});
  }
}

module.exports = ctrl;