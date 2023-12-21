import Publication from "../Models/Publication.js";
import User from "../Models/User.js";
import moment from "moment";
var time = moment().format("MMMM Do YYYY, h:mm:ss a");

const createPost = async (req, res) => {
  try {
    const { idCreator, description, mentions, feature } = req.body;

    if (!idCreator)
      return res
        .status(401)
        .json({ auth: false, message: "Invalid credentials" });
    if (!description || !feature)
      return res
        .status(400)
        .json({
          message: "An error creating pots, you should check again the inputs",
        });

    const user = await User.findById(idCreator).catch((err) => {
        console.log(err)
      return res.status(400).json({ auth: false, message: "the user credentials invalided" });
    });
    // console.log(user)
    if (!user)
      return res
        .status(404)
        .json({ auth: false, message: "The user not found" });

    var condition = false;
    if (feature) {
      if (user.tokenFeatures > 0) condition = true;
    }
    const post = await new Publication({
      idCreator: idCreator,
      date: time,
      content: [
        {
          description: description,
          mentions: [],
          images: [],
        },
      ],
      featured: condition,
    }).save();

    console.log(post);

    const result  = await User.updateOne(
      { _id: idCreator },
      { $push: { post: post._id } },
    ).catch((err) => {
        console.log(err)
    })
    console.log(result)

    return res
      .status(200)
      .json({ message: "The post has been created successly!" });
  } catch (error) {
    console.log("An error has ocurred in the server 500");
  }
};

const getsPostByIdUser = async(req, res) => {
  try {
    const {id} = req.params
    // const publications 
  } catch (error) {
    console.log("An error has been in the server", error)
  }
}

export default {
  createPost,
};
