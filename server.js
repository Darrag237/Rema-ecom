// سيرفر مخصص لتشغيل تطبيق Next.js على المنفذ 5050
const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const hostname = process.env.HOSTNAME || "localhost"
const port = Number.parseInt(process.env.PORT || "5050", 10)

// إنشاء تطبيق Next.js
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // تحليل عنوان URL المطلوب
      const parsedUrl = parse(req.url, true)

      // السماح بطلبات webhook من Stripe
      if (parsedUrl.pathname === "/api/payment/webhook") {
        const chunks = []
        req.on("data", (chunk) => {
          chunks.push(chunk)
        })
        req.on("end", () => {
          req.body = Buffer.concat(chunks)
          handle(req, res, parsedUrl)
        })
      } else {
        // معالجة الطلبات الأخرى
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error("خطأ في معالجة الطلب:", err)
      res.statusCode = 500
      res.end("خطأ داخلي في الخادم")
    }
  })
    .once("error", (err) => {
      console.error("خطأ في بدء تشغيل الخادم:", err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> تم بدء تشغيل الخادم على http://${hostname}:${port}`)
    })
})
