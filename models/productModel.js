import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
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
      ref: "users", // Make sure to replace "User" with the correct model name for users
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category", // Make sure to replace "Category" with the correct model name for categories
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    companyEmail: {
      type: String,
      required: true,
    },
    linkedin: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    companylinkedin: {
      type: String,
    },
    website: {
      type: String,
    },
    revenue: {
      type: String,
    },
    teamsize: {
      type: String,
      required: true,
    },
    privateround: {
      type: String,
      required: true,
    },
    fundraising: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    traction: {
      type: String,
    },
    commitment: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
