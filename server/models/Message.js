import mongoose from "mongoose";

const statusSchema = new mongoose.Schema(
  {
    user: String,
    state: { type: String, enum: ["sent", "delivered", "seen"], default: "sent" },
    ts: { type: Date, default: Date.now },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: String, required: true },
  ts: { type: Date, default: Date.now },
  status: { type: [statusSchema], default: [] },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
