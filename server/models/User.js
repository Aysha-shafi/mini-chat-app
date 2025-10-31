import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  avatar: String,
  lastSeen: Date,
});

const User = mongoose.model("User", userSchema);
export default User;
