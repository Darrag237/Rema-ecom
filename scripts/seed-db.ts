import mongoose from "mongoose"
import User from "../models/user"
import Product from "../models/product"
import Category from "../models/category"

// تكوين الاتصال بقاعدة البيانات
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/rima"

// المستخدمين الافتراضيين
const defaultUsers = [
  {
    name: "مدير النظام",
    email: "admin@rima.com",
    password: "Admin@123",
    role: "admin",
  },
  {
    name: "بائع تجريبي",
    email: "seller@rima.com",
    password: "Seller@123",
    role: "seller",
  },
  {
    name: "عميل تجريبي",
    email: "customer@rima.com",
    password: "Customer@123",
    role: "customer",
  },
]

// التصنيفات الافتراضية
const defaultCategories = [
  { name: "فساتين", slug: "dresses", image: "/placeholder.svg?height=400&width=300" },
  { name: "تيشيرتات", slug: "t-shirts", image: "/placeholder.svg?height=400&width=300" },
  { name: "بناطيل", slug: "pants", image: "/placeholder.svg?height=400&width=300" },
  { name: "بلوزات", slug: "blouses", image: "/placeholder.svg?height=400&width=300" },
  { name: "تنانير", slug: "skirts", image: "/placeholder.svg?height=400&width=300" },
  { name: "جاكيتات", slug: "jackets", image: "/placeholder.svg?height=400&width=300" },
]

// المنتجات الافتراضية (سيتم إضافتها بعد إنشاء المستخدمين والتصنيفات)
const createDefaultProducts = async (sellerId: string, categoryIds: Record<string, string>) => {
  const defaultProducts = [
    {
      name: "فستان صيفي أنيق",
      description: "فستان صيفي أنيق مصنوع من القطن المريح، مثالي للمناسبات النهارية والإطلالات الصيفية المميزة.",
      price: 299,
      oldPrice: 399,
      category: categoryIds["dresses"],
      seller: sellerId,
      sizes: [
        { name: "S", inventory: 10 },
        { name: "M", inventory: 15 },
        { name: "L", inventory: 8 },
      ],
      colors: [
        { name: "أزرق", value: "#0000ff" },
        { name: "أبيض", value: "#ffffff" },
      ],
      images: ["/placeholder.svg?height=600&width=400"],
      features: ["قماش قطني 100%", "مناسب للغسيل اليدوي والآلي", "تصميم عصري وأنيق"],
      specifications: {
        material: "قطن 100%",
        style: "كاجوال",
        season: "صيف",
      },
      isActive: true,
    },
    {
      name: "بلوزة كاجوال",
      description: "بلوزة كاجوال مريحة مناسبة للاستخدام اليومي مع تصميم عصري.",
      price: 149,
      category: categoryIds["blouses"],
      seller: sellerId,
      sizes: [
        { name: "S", inventory: 12 },
        { name: "M", inventory: 18 },
        { name: "L", inventory: 10 },
      ],
      colors: [
        { name: "أحمر", value: "#ff0000" },
        { name: "أسود", value: "#000000" },
      ],
      images: ["/placeholder.svg?height=600&width=400"],
      features: ["خامة مريحة", "سهلة التنظيف", "متعددة الاستخدامات"],
      specifications: {
        material: "قطن مخلوط",
        style: "كاجوال",
        season: "جميع المواسم",
      },
      isActive: true,
    },
    {
      name: "بنطلون جينز عصري",
      description: "بنطلون جينز عصري بقصة مستقيمة مناسب لجميع المناسبات.",
      price: 199,
      category: categoryIds["pants"],
      seller: sellerId,
      sizes: [
        { name: "M", inventory: 8 },
        { name: "L", inventory: 12 },
        { name: "XL", inventory: 6 },
      ],
      colors: [
        { name: "أزرق داكن", value: "#00008b" },
        { name: "أسود", value: "#000000" },
      ],
      images: ["/placeholder.svg?height=600&width=400"],
      features: ["جينز عالي الجودة", "قصة مريحة", "متين"],
      specifications: {
        material: "دينيم",
        style: "كاجوال",
        season: "جميع المواسم",
      },
      isActive: true,
    },
  ]

  for (const productData of defaultProducts) {
    const existingProduct = await Product.findOne({ name: productData.name })
    if (!existingProduct) {
      await Product.create(productData)
      console.log(`تم إنشاء المنتج: ${productData.name}`)
    }
  }
}

// دالة البذر الرئيسية
const seedDatabase = async () => {
  try {
    // الاتصال بقاعدة البيانات
    await mongoose.connect(MONGODB_URI)
    console.log("تم الاتصال بقاعدة البيانات بنجاح")

    // إنشاء المستخدمين الافتراضيين
    let sellerId = ""
    for (const userData of defaultUsers) {
      const existingUser = await User.findOne({ email: userData.email })
      if (!existingUser) {
        const newUser = await User.create(userData)
        console.log(`تم إنشاء المستخدم: ${userData.name} (${userData.role})`)

        // حفظ معرف البائع لاستخدامه في إنشاء المنتجات
        if (userData.role === "seller") {
          sellerId = newUser._id.toString()
        }
      } else {
        if (userData.role === "seller" && !sellerId) {
          sellerId = existingUser._id.toString()
        }
        console.log(`المستخدم موجود بالفعل: ${userData.email}`)
      }
    }

    // إنشاء التصنيفات الافتراضية
    const categoryIds: Record<string, string> = {}
    for (const categoryData of defaultCategories) {
      const existingCategory = await Category.findOne({ slug: categoryData.slug })
      if (!existingCategory) {
        const newCategory = await Category.create(categoryData)
        categoryIds[categoryData.slug] = newCategory._id.toString()
        console.log(`تم إنشاء التصنيف: ${categoryData.name}`)
      } else {
        categoryIds[categoryData.slug] = existingCategory._id.toString()
        console.log(`التصنيف موجود بالفعل: ${categoryData.name}`)
      }
    }

    // إنشاء المنتجات الافتراضية
    if (sellerId) {
      await createDefaultProducts(sellerId, categoryIds)
    } else {
      console.log("لم يتم العثور على بائع لإنشاء المنتجات")
    }

    console.log("تم بذر قاعدة البيانات بنجاح")
  } catch (error) {
    console.error("خطأ أثناء بذر قاعدة البيانات:", error)
  } finally {
    // إغلاق الاتصال بقاعدة البيانات
    await mongoose.disconnect()
    console.log("تم إغلاق الاتصال بقاعدة البيانات")
  }
}

// تنفيذ البذر إذا تم تشغيل الملف مباشرة
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("خطأ غير متوقع:", error)
      process.exit(1)
    })
}

export default seedDatabase
