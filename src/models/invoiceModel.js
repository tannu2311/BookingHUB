import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: "users" },
    Details :{}
},
    { timestamps: true }
)

const invoiceModel = mongoose.models.invoices || mongoose.model('invoices', invoiceSchema);

export default invoiceModel;

