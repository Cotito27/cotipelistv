const ctrl = {};
const Reaction = require('../models/Reaction.model');

ctrl.index = async (req, res) => {
  let _id = req.params.id;
  const reaction = await Reaction.findOne({ video_id: _id });
  res.json({
    likes: reaction.likes.length,
    dislikes: reaction.dislikes.length
  })
}

ctrl.like = async (req, res) => {
  let _id = req.params.id;
  let user_id = req.query.user_id;
  // console.log(user_id);
  // console.log(_id);
  const reaction = await Reaction.findOne({video_id: _id});
  if (reaction) {
    let verifyRepeatLikes = reaction.likes.includes(user_id);
    let verifyRepeatDislikes = reaction.dislikes.includes(user_id);
    if(verifyRepeatDislikes) {
      let indexUserR = reaction.dislikes.indexOf(user_id);
      reaction.dislikes.splice(indexUserR, 1);
    } 
    if(verifyRepeatLikes) {
      let indexUserR = reaction.likes.indexOf(user_id);
      reaction.likes.splice(indexUserR, 1);
    } else {
      reaction.likes.push(user_id);
    }
    // comment.likes = {
    //   count: comment.likes.count + 1,
    //   user_id
    // };
    await reaction.save();
    res.json({likes: reaction.likes, dislikes: reaction.dislikes})
  } else {
    let newReaction = new Reaction({
      video_id: _id,
      user_id: user_id,
      likes: [user_id],
      dislikes: []
    });
    let dataNew = await newReaction.save();
    res.json({likes: dataNew.likes, dislikes: dataNew.dislikes});
    // res.status(500).json({error: 'Internal Error'});
  }
}

ctrl.dislike = async (req, res) => {
  let _id = req.params.id;
  let user_id = req.query.user_id;
  // console.log(user_id);
  // console.log(_id);
  const reaction = await Reaction.findOne({video_id: _id});
  if (reaction) {
    let verifyRepeatLikes = reaction.likes.includes(user_id);
    let verifyRepeatDislikes = reaction.dislikes.includes(user_id);
    if(verifyRepeatLikes) {
      let indexUserR = reaction.likes.indexOf(user_id);
      reaction.likes.splice(indexUserR, 1);
    }
    if(verifyRepeatDislikes) {
      let indexUserR = reaction.dislikes.indexOf(user_id);
      reaction.dislikes.splice(indexUserR, 1);
    } else {
      reaction.dislikes.push(user_id);
    }
    await reaction.save();
    res.json({likes: reaction.likes, dislikes: reaction.dislikes})
  } else {
    let newReaction = new Reaction({
      video_id: _id,
      user_id: user_id,
      likes: [],
      dislikes: [user_id]
    });
    let dataNew = await newReaction.save();
    res.json({likes: dataNew.likes, dislikes: dataNew.dislikes});
    // res.status(500).json({error: 'Internal Error'});
  }
}

module.exports = ctrl;