import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "seller" | "customer"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "الرجاء إدخال الاسم"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "الرجاء إدخال البريد الإلكتروني"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "الرجاء إدخال بريد إلكتروني صالح"],
    },
    password: {
      type: String,
      required: [true, "الرجاء إدخال كلمة المرور"],
      minlength: [6, "يجب أن تكون كلمة المرور 6 أحرف على الأقل"],
    },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  },
)

// تشفير كلمة المرور قبل الحفظ
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// مقارنة كلمة المرور
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
