import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  myUploadsController,
  // productCountController,
  // productFiltersController,
  // productListController,
  productPhotoController,
  updateProductController,
  getSingleProductControllerinvestor,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn, isInvestor, isFounder } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.post(
  "/user-create-product",
  requireSignIn,
  formidable(),
  isFounder,
  createProductController
);
//routes
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get products
router.get("/get-product",requireSignIn, getProductController);
// To this
router.get("/my-pitch", requireSignIn, isFounder, myUploadsController);

//single product
router.get("/get-product/:slug",requireSignIn, getSingleProductController);
// router.get("/get-product/:slug",requireSignIn, getSingleProductController);

// router.get("/get-product-founder/:slug",isFounder,requireSignIn, getSingleProductController);
// router.get("/get-product-investor/:slug",isInvestor,requireSignIn, getSingleProductControllerinvestor);
//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);

//filter product
// router.post("/product-filters", productFiltersController);

// //product count
// router.get("/product-count", productCountController);

// //product per page
// router.get("/product-list/:page", productListController);
// router.get("/product-list-investor/:page",isInvestor,requireSignIn, productListController);

router.get("/ideas",requireSignIn, isInvestor)

export default router;