import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";
import fs from "fs";
import slugify from "slugify";
import { v4 as uuidv4 } from 'uuid';

export const createProductController = async (req, res) => {
  try {
    const { name, description, userid, username, category, company } = req.fields;
    const { photo, document } = req.files; // Destructure the files object to get photo and documents
    // Validation...
    switch (true) {
            case !name:
              return res.status(500).send({ error: "Name is Required" });
            case !description:
              return res.status(500).send({ error: "Description is Required" });
            case !userid:
              return res.status(500).send({ error: "userid is Required" });
            case !username:
              return res.status(500).send({ error: "username is Required" });
            case !category:
              return res.status(500).send({ error: "Category is Required" });
           
            case photo && photo.size > 1000000:
              return res
                .status(500)
                .send({ error: "photo is Required and should be less then 1mb" });
          }
    
    const products = new productModel({ ...req.fields, slug: slugify(company) });
    
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    if (document) {
      // Assuming you're storing the document in the database
      products.document = {
        name: document.name,
        data: fs.readFileSync(document.path),
        contentType: document.type,
      };
    }
    // Handle documents

    
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};



// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};
export const getSingleProductController2 = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ _id: req.params.id })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};




export const getSingleProductControllerinvestor = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

//myuploads
// And update your controller to use req.query instead of req.body
export const myUploadsController = async (req, res) => {
  try {
    const { userid } = req.query;

    const args = { userid }; // Initialize args with userid

    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering Products",
      error,
    });
  }
};


export const myUploadsController2 = async (req, res) => {
  try {
    const { userid } = req.query;

    const args = { userid }; // Initialize args with userid

    const carts = await cartModel.find(args);
    res.status(200).send({
      success: true,
      carts,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error While Filtering carts",
      error,
    });
  }
};


export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId } = req.body; // Assuming userId is sent in the request body

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the user is the creator of the product
    if (product.userid.toString() !== userId) {
      return res.status(401).json({ error: 'You are not authorized to edit this product' });
    }

    const { company, description, category } = req.body;

    product.company = company || product.company;
    product.description = description || product.description;
    product.category = category || product.category;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error editing product:', error);
    res.status(500).json({ error: ' server error' });
  }
};




// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr while getting photo",
      error,
    });
  }
};
export const downloadDocumentController = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await productModel.findById(productId); // Using Product model here
    if (!product || !product.document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.set('Content-Type', product.document.contentType);
    res.set('Content-Disposition', `attachment; filename="${product.document.name}"`);
    res.send(product.document.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//upate producta
// export const updateProductController = async (req, res) => {
//   try {
//     const { name, description, category,  } =
//       req.fields;
//     const { photo } = req.files;
//     //alidation
//     switch (true) {
//       case !name:
//         return res.status(500).send({ error: "Name is Required" });
//       case !description:
//         return res.status(500).send({ error: "Description is Required" });
//       case !category:
//         return res.status(500).send({ error: "Category is Required" });
     
//       case photo && photo.size > 1000000:
//         return res
//           .status(500)
//           .send({ error: "photo is Required and should be less then 1mb" });
//     }

//     const products = await productModel.findByIdAndUpdate(
//       req.params.pid,
//       { ...req.fields, slug: slugify(name) },
//       { new: true }
//     );
//     if (photo) {
//       products.photo.data = fs.readFileSync(photo.path);
//       products.photo.contentType = photo.type;
//     }
//     await products.save();
//     res.status(201).send({
//       success: true,
//       message: "Product Updated Successfully",
//       products,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error in Updte product",
//     });
//   }
// };
export const updateProductController = async (req, res) => {
  try {
    const { company, description, category } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!company || !description || !category) {
      return res.status(400).json({ error: "Name, description, and category are required." });
    }

    // Find the product by ID and update
    const product = await productModel.findById(req.params.pid);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Update product fields
    product.company = company;
    product.description = description;
    product.category = category;

    // Update photo if provided
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // Save updated product
    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully.", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};


export const editProductController = async (req, res) => {
  try {
    const { company, description, category } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!company || !description || !category) {
      return res.status(400).json({ error: "Name, description, and category are required." });
    }

    // Find the product by ID and update
    const product = await productModel.findById(req.params.pid);

    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Update product fields
    product.company = company;
    product.description = description;
    product.category = category;

    // Update photo if provided
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    // Save updated product
    await product.save();

    res.status(200).json({ success: true, message: "Product updated successfully.", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, error: "Internal server error." });
  }
};



