#!/bin/bash

# سكريبت بدء تشغيل تطبيق Rima باستخدام PM2

# التأكد من وجود ملف .env
if [ ! -f .env ]; then
  echo "خطأ: ملف .env غير موجود. يرجى إنشاء الملف باستخدام .env.example"
  exit 1
fi

# تثبيت PM2 إذا لم يكن موجودًا
if ! command -v pm2 &> /dev/null; then
  echo "تثبيت PM2..."
  npm install -g pm2
fi

# تثبيت الاعتماديات
echo "تثبيت الاعتماديات..."
npm ci

# بناء التطبيق
echo "بناء التطبيق..."
npm run build

# بدء تشغيل التطبيق باستخدام PM2
echo "بدء تشغيل التطبيق باستخدام PM2..."
pm2 start ecosystem.config.js --env production

# حفظ إعدادات PM2
pm2 save

# عرض حالة التطبيق
pm2 status

echo "تم بدء تشغيل التطبيق بنجاح!"
echo "يمكنك الوصول إلى التطبيق على المنفذ 5050"
