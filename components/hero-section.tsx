import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <div className="relative h-[500px] overflow-hidden">
      <Image
        src="/placeholder.svg?height=1080&width=1920"
        alt="Rima Fashion"
        width={1920}
        height={1080}
        className="object-cover w-full h-full"
        priority
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">أزياء Rima</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl">
          اكتشفي أحدث صيحات الموضة النسائية مع تشكيلة متنوعة من الملابس العصرية
        </p>
        <div className="flex gap-4">
          <Button asChild size="lg" className="bg-rose-600 hover:bg-rose-700">
            <Link href="/products">تسوق الآن</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
            <Link href="/categories">استكشف الفئات</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
