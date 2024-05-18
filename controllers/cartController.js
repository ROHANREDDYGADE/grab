
  

import cartModel from "../models/cartModel.js";
import Product from "../models/productModel.js";
export const addToFavoritesController = async (req, res) => {
  try {
    const { productid, userid, username, slug, phone } = req.body; // Extract slug from req.body

    // Validation
    if (!productid || !userid || !username || !slug || !phone) {
      return res.status(400).json({ error: "Product ID, User ID, Username, and Slug are required." });
    }

    const newCartItem = new cartModel({ productid, slug, userid, username,phone });
    await newCartItem.save();

    res.status(201).json({ success: true, message: "Product added to favorites successfully.", cartItem: newCartItem });
  } catch (error) {
    console.error("Error adding product to favorites:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};


export const removeFromFavoritesController = async (req, res) => {
  try {
    const { productid, userid } = req.body;

    await cartModel.findOneAndDelete({ productid, userid });

    res.status(200).json({ success: true, message: "Product removed from favorites successfully." });
  } catch (error) {
    console.error("Error removing product from favorites:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export const isProductInFavoritesController = async (req, res) => {
  try {
    const { productid, userid } = req.params;

    const favoriteItem = await cartModel.findOne({ productid, userid });

    if (favoriteItem) {
      return res.status(200).json({ isFavorite: true });
    } else {
      return res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.error("Error checking favorite status:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};

export const getProductsByUserId = async (req, res) => {
    try {
      const userId = req.user._id; // Get user ID from authenticated user
  
      // Find all products in the user's cart
      const cartItems = await cartModel.find({ userid: userId });
  
      // Extract product IDs from cart items
      const productIds = cartItems.map((item) => item.productid);
  
      // Find products associated with the user's cart items
      const products = await Product.find({ _id: { $in: productIds } });
  
      res.status(200).json({ success: true, products });
    } catch (error) {
      console.error("Error fetching products by user ID:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };





  export const getAllCartItemsController = async (req, res) => {
    try {
      // Fetch all cart items from the database
      const cartItems = await cartModel.find();
  
      // Return the cart items
      res.status(200).json({ success: true, cartItems });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  };