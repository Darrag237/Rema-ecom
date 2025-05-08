// سكريبت تهيئة MongoDB
print("بدء تهيئة قاعدة بيانات MongoDB...")

// إنشاء قاعدة البيانات والمستخدم
var db = db.getSiblingDB("rima")

// إنشاء مستخدم لقاعدة البيانات إذا لم يكن موجودًا
if (!db.getUser("rimauser")) {
  db.createUser({
    user: "rimauser",
    pwd: "rimapassword",
    roles: [{ role: "readWrite", db: "rima" }],
  })
  print("تم إنشاء مستخدم قاعدة البيانات بنجاح")
} else {
  print("مستخدم قاعدة البيانات موجود بالفعل")
}

// إنشاء المجموعات الأساسية
db.createCollection("users")
db.createCollection("products")
db.createCollection("categories")
db.createCollection("orders")
db.createCollection("carts")
db.createCollection("wishlists")

print("تم إنشاء المجموعات الأساسية بنجاح")
print("اكتملت تهيئة قاعدة بيانات MongoDB")
