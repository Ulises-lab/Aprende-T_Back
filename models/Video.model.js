const { Schema, model, SchemaType, SchemaTypes } = require("mongoose");

const userSchema = new Schema(
  {
  name_course: {
    type: String,
    trim: true,
    required: true
    },
  name_videos:{
    type:String,
    required:true,
    enum:[]
  },
  videos_files: {
    type: String,
    require: true,
    enum:[]
  }
  },
  {timestamps:true}
  );

const Video = model("Video", userSchema);