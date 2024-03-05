const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const {
  createTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
  getTransactionemail,
  deleteTransaction,
} = require('../controllers/adminController');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route('/Transactions')
  .get(getTransactions)
  .post(
    protect,
    upload.single('logo'),
    createTransaction
  );

router.route('/Transactions/:id')
  .get(getTransaction)
  .put(
    protect,
    upload.single('logo'),
    updateTransaction
  )
  .delete(protect, deleteTransaction);

router.route('/Transactions/email/:value')
  .get(getTransactionemail);

module.exports = router;
