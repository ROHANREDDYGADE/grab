import express from "express";
import {
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  getSingleProductController2,
  myUploadsController,
  // productCountController,
  // productFiltersController,
  // productListController,
  downloadDocumentController,
  productPhotoController,
  updateProductController,
  editProduct,
  editProductController,
  myUploadsController2

  // cartRoute

} from "../controllers/productController.js";
import { isAdmin, requireSignIn, isInvestor, isFounder } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import {
  addToFavoritesController,
  isProductInFavoritesController,
  removeFromFavoritesController,
  getProductsByUserId,
  getAllCartItemsController

} from "../controllers/cartController.js";


const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);
// app.use("/cart", cartRoutes);
router.post("/add-to-favorites", addToFavoritesController);
router.post("/remove-from-favorites", removeFromFavoritesController);
router.get('/is-favorite/:productid/:userid', isProductInFavoritesController);
router.get('/my-favorites', getProductsByUserId, requireSignIn)
router.get("/cartall", getAllCartItemsController);

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
router.put(
  "/edit-product/:pid",
  requireSignIn,
  formidable(),
  editProductController
);

//get products
router.get("/get-product",requireSignIn, getProductController);
// To this
router.get("/my-pitch", requireSignIn,isFounder, myUploadsController);
router.get("/my-pitch-2", requireSignIn, myUploadsController2);

//single product
router.get("/get-product/:slug",requireSignIn, getSingleProductController);

router.get("/product-photo/:pid", productPhotoController);
router.put('/edit-product/:productId',editProduct);
//delete rproduct
router.delete("/delete-product/:pid", deleteProductController);
router.get("/download-document/:productId", requireSignIn, downloadDocumentController);


router.get("/ideas",requireSignIn, isInvestor)

export default router;