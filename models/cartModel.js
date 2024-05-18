import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    productid: {
      type: mongoose.ObjectId,
      ref: "Product",
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    userid: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },
    phone: {
      type: String,
      required: true,
      ref:"users"
    },
  },
  { timestamps: true }
);

export default mongoose.model("cart", cartSchema);
