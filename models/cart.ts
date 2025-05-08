import mongoose, { Schema, type Document } from "mongoose"

export interface ICartItem {
  product: mongoose.Types.ObjectId
  name: string
  price: number
  color: string
  size: string
  quantity: number
  image: string
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId
  items: ICartItem[]
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
    required: true,
  },
})

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)
