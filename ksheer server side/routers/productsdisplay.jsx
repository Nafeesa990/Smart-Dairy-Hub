const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const router = express.Router();


//multer codes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'productimage/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null,  '-' + uniqueSuffix+ "-" + file.originalname )
    }
  })
  
  const upload = multer({ storage: storage })

  //mongoose
  const productuploadSchema = new mongoose.Schema({
    name: String,
    des: String,
    price: Number,
    filepath: String,
  });
  
  const productuploadModel = mongoose.model('productupload', productuploadSchema); 

  //api upload
  router.route('/productupload').post(upload.single('image'),async(req,res)=>{
    const name=req.body.name;
    const  des=req.body.des;
    const price= req.body.price;
    const fpath=req.file.filename;
    productuploadModel.create({
        'name': name ,
        'des':des,
        'price':price,
        'filepath':fpath

    })
    res.json("upload successfull")
  })

  //display
  router.route('/productview').get(async(req,res)=>{
    //console.log("inside")
    const result=await productuploadModel.find();
    res.json({'result':result})
  })

  //display product with id
  // Fetch a single product by ID
router.route('/productviews/:id').get(async (req, res) => {
  try {
      const product = await productuploadModel.findById(req.params.id);
      
      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});


  // ✅ API to edit/update product
  router.put('/productupdate/:id', upload.single('image'), async (req, res) => {
      try {
          const id = req.params.id;
          const { name, des, price } = req.body;
          let updateData = { name, des, price };
  
          if (req.file) {
              updateData.filepath = req.file.filename;
          }
  
          const updatedProduct = await productuploadModel.findByIdAndUpdate(id, updateData, { new: true });
  
          if (!updatedProduct) {
              return res.status(404).json({ message: "Product not found" });
          }
  
          res.json({ message: "Product updated successfully", updatedProduct });
      } catch (error) {
          res.status(500).json({ message: "Error updating product", error });
      }
  });

  // Delete product by ID
router.route('/productdelete/:id').delete(async (req, res) => {
  try {
      const productId = req.params.id;
      await productuploadModel.findByIdAndDelete(productId);
      res.json({ message: "Product deleted successfully" });
  } catch (error) {
      res.status(500).json({ error: "Error deleting product" });
  }
});


  module.exports=router;