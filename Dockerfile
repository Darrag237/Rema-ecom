# استخدام Node.js كصورة أساسية
FROM node:18-alpine AS base

# تثبيت المتطلبات الأساسية
RUN apk add --no-cache libc6-compat netcat-openbsd bash
WORKDIR /app

# تثبيت الاعتماديات فقط
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# تثبيت ts-node لتشغيل سكريبت البذر
RUN npm install -g ts-node typescript

# بناء التطبيق
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# تعيين متغيرات البيئة للبناء
ARG MONGODB_URI
ARG NEXTAUTH_SECRET
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG NEXT_PUBLIC_APP_URL

ENV MONGODB_URI=$MONGODB_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY
ENV STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

# بناء التطبيق
RUN npm run build

# إعداد صورة الإنتاج
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 5050
ENV HOSTNAME "0.0.0.0"

# إنشاء مستخدم غير جذري للأمان
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# نسخ الملفات اللازمة
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/models ./models
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# جعل سكريبت البدء قابل للتنفيذ
RUN chmod +x ./docker-entrypoint.sh

# تثبيت ts-node لتشغيل سكريبت البذر
RUN npm install -g ts-node typescript

# تعريض المنفذ 5050
EXPOSE 5050

# تغيير المستخدم إلى المستخدم غير الجذري
USER nextjs

# تشغيل التطبيق
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
