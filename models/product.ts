import mongoose, { Schema, type Document } from "mongoose"

export interface ISize {
  name: string
  inventory: number
}

export interface IColor {
  name: string
  value: string
}

export interface IReview {
  user: mongoose.Types.ObjectId
  rating: number
  title: string
  comment: string
  createdAt: Date
}

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  oldPrice?: number
  category: string
  subcategory?: string
  sizes: ISize[]
  colors: IColor[]
  images: string[]
  features: string[]
  specifications: Record<string, string>
  seller: mongoose.Types.ObjectId
  reviews: IReview[]
  averageRating: number
  totalInventory: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const SizeSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  inventory: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
})

const ColorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
})

const ReviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "الرجاء إدخال اسم المنتج"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "الرجاء إدخال وصف المنتج"],
    },
    price: {
      type: Number,
      required: [true, "الرجاء إدخال سعر المنتج"],
      min: [0, "يجب أن يكون السعر أكبر من أو يساوي 0"],
    },
    oldPrice: {
      type: Number,
      min: [0, "يجب أن يكون السعر القديم أكبر من أو يساوي 0"],
    },
    category: {
      type: String,
      required: [true, "الرجاء إدخال تصنيف المنتج"],
      enum: ["dresses", "t-shirts", "pants", "blouses", "skirts", "jackets"],
    },
    subcategory: {
      type: String,
    },
    sizes: [SizeSchema],
    colors: [ColorSchema],
    images: {
      type: [String],
      required: [true, "الرجاء إضافة صورة واحدة على الأقل"],
    },
    features: [String],
    specifications: {
      type: Map,
      of: String,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews: [ReviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    totalInventory: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// حساب إجمالي المخزون قبل الحفظ
ProductSchema.pre("save", function (next) {
  if (this.isModified("sizes")) {
    this.totalInventory = this.sizes.reduce((total, size) => total + size.inventory, 0)
  }
  next()
})

// حساب متوسط التقييم قبل الحفظ
ProductSchema.pre("save", function (next) {
  if (this.isModified("reviews")) {
    const totalReviews = this.reviews.length
    if (totalReviews > 0) {
      const sumRatings = this.reviews.reduce((sum, review) => sum + review.rating, 0)
      this.averageRating = sumRatings / totalReviews
    } else {
      this.averageRating = 0
    }
  }
  next()
})

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)
