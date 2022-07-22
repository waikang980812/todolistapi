const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const todoitemSchema = new Schema({
  name: String,
  description: String,
  creationDate: Date,
  status: String,
  remark: String,
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User"
}
  
});

const todoItem = mongoose.model("todoitem", todoitemSchema);

module.exports = todoItem;
