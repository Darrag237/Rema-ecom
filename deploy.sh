#!/bin/bash

# سكريبت نشر تطبيق Rima

# التأكد من وجود ملف .env
if [ ! -f .env ]; then
  echo "خطأ: ملف .env غير موجود. يرجى إنشاء الملف باستخدام .env.example"
  exit 1
fi

# تحديث الكود من Git (إذا كان مستخدمًا)
# git pull origin main

# تثبيت الاعتماديات
echo "تثبيت الاعتماديات..."
npm ci

# بناء التطبيق
echo "بناء التطبيق..."
npm run build

# إنشاء مجلدات Nginx إذا لم تكن موجودة
mkdir -p nginx/logs nginx/ssl

# التحقق من وجود شهادات SSL
if [ ! -f nginx/ssl/rima.crt ] || [ ! -f nginx/ssl/rima.key ]; then
  echo "تحذير: شهادات SSL غير موجودة في nginx/ssl/"
  echo "يرجى وضع شهادات SSL الخاصة بك في المجلد nginx/ssl/ قبل تشغيل Docker"
fi

# بدء تشغيل الخدمات باستخدام Docker Compose
echo "بدء تشغيل الخدمات..."
docker-compose up -d --build

echo "تم نشر التطبيق بنجاح!"
echo "يمكنك الوصول إلى التطبيق على المنفذ 5050 أو من خلال Nginx على المنفذ 80/443"
