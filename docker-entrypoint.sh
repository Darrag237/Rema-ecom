#!/bin/bash
set -e

# انتظار جاهزية MongoDB
echo "انتظار جاهزية MongoDB..."
for i in {1..30}; do
  if nc -z mongodb 27017; then
    echo "MongoDB جاهز!"
    break
  fi
  echo "انتظار MongoDB... محاولة $i/30"
  sleep 2
done

# التحقق من نجاح الاتصال بـ MongoDB
if ! nc -z mongodb 27017; then
  echo "فشل الاتصال بـ MongoDB بعد 30 محاولة. إنهاء التطبيق."
  exit 1
fi

# بذر قاعدة البيانات بالبيانات الافتراضية
echo "بذر قاعدة البيانات..."
node -r ts-node/register scripts/seed-db.ts

# بدء تشغيل التطبيق
echo "بدء تشغيل تطبيق Rima..."
exec "$@"
