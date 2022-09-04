const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    _author: { type: Schema.Types.ObjectId, ref: "Student" },
    comment: String,
    _instructor: {type: Schema.Types.ObjectId, ref: "Instructor" },
  },
  {
    timestamps: true
  }
);

//requiere el id del Student.

const Comment = model("Comment", commentSchema);

module.exports = Comment;                          
