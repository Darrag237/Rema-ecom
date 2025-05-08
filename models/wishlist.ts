import mongoose, { Schema, type Document } from "mongoose"

export interface IWishlist extends Document {
  user: mongoose.Types.ObjectId
  products: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const WishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema)
