const Admin = require("../models/Admin");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
    console.log(file);
  },
  fi: function (req, file, cb) {
    cb(null, file.origin);
  },
});

const upload = multer({ storage });

cloudinary.config({
  cloud_name: process.env.CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const handleImageUpload = async (imageFile) => {
  try {
    const result = await cloudinary.uploader.upload(imageFile.path, {
      width: 500,
      height: 500,
      crop: "scale",
    });
    return result.secure_url;
  } catch (error) {
    console.error(error);
    throw new Error("Error uploading image");
  }
};

const createTransaction = async (req, res) => {
  const {
    address, hash, price, email, 
  } = req.body;

  const logo = req.file; 

  if (!logo) {
    res.status(400).json({ error: "All image required" });
    return;
  }

  try {
    const logoUrl = await handleImageUpload(logo);
    const Transaction = await Admin.create({
      address,
      hash,
      price,
      email,
      logo: logoUrl,
    });

    res.status(201).json({
      _id: Transaction._id,
      address: Transaction.address,
      hash: Transaction.hash,
      email: Transaction.email,
      price: Transaction.price,
      logo: Transaction.logo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred when creating the Transaction" });
  }
};


const updateTransaction = async (req, res) => {
  const Transaction = await Admin.findById(req.params.id);

  if (!Transaction) {
    return res
      .status(404)
      .json({ message: "Transaction does not exist" });
  } else {
    const {
      address, hash, price, email, 
    } = req.body;

    try {
      let logo = Transaction.logo;

      if (req.file) {
        const result = await cloudinary.uploader.upload(
          req.file.path,
          {
            crop: "scale",
          }
        );
        logo = result.secure_url;
      }

      const updatedTransaction = await Admin.findByIdAndUpdate(
        req.params.id,
        {
          address, hash, price, email, 
        },
        { new: true }
      );

      res.status(200).json(updatedTransaction);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating Transaction" });
    }
  }
};

const getTransaction = async (req, res) => {
  try {
    const Transaction = await Admin.findById(req.params.id);
    if (!Transaction) {
      return res.status(404).json({ message: "This Transaction does not exist" });
    } else {
      res.status(200).json(Transaction);
    }
  } catch (err) {
    console.log(err);
  }
};

const getTransactionemail = async (req, res) => {
  try {
    const Transactions = await Admin.find({
      email: decodeURIComponent(req.params.value),
    });
    if (Transactions.length === 0) {
      return res.status(404).json({ message: "Transactions not found" });
    } else {
      res.status(200).json(Transactions);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching Transactions" });
  }
};

const getTransactions = async (req, res) => {
  try {
    const Transactions = await Admin.find({
      email: { $exists: true },
    });
    if (!Transactions) {
      return res.status(404).json({ message: "Transactions not found" });
    } else {
      res.status(200).json(Transactions);
    }

    return;
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred when fetching Transactions" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const Transaction = await Admin.findById(req.params.id);
    if (!Transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    await Admin.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: req.params.id, message: "Transaction deleted" });
    return;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  getTransaction,
  getTransactionemail,
  getTransactions,
  deleteTransaction,
};