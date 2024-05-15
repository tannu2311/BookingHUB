const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema({

  paymentMethod: {
    type: String,
    enum: ['paypal', 'stripe'], 
    required: true,
  },

  publicKey: String,
  secretKey: String,
  status:{type: Number}, // 0 inactive and 1 active
 
  accountId: {
    type: String,
  },

  userId: {
    type: mongoose.Types.ObjectId,
    ref: "users",
  },


  campaigns : [{
    id :  mongoose.Types.ObjectId,
    name : String
  }],

},{ timestamps: true }
);

const paymentMethodModel = mongoose.models.paymentMethods || mongoose.model('paymentMethods', paymentMethodSchema);

export default paymentMethodModel;
