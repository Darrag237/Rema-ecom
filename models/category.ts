import mongoose, { Schema, type Document } from "mongoose"

export interface ICategory extends Document {
  name: string
  slug: string
  image: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "الرجاء إدخال اسم التصنيف"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "الرجاء إدخال الرابط المختصر للتصنيف"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "الرجاء إضافة صورة للتصنيف"],
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)
