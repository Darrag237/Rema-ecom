import Link from "next/link"
import Image from "next/image"

const categories = [
  { id: 1, name: "فساتين", image: "/placeholder.svg?height=400&width=300", slug: "dresses" },
  { id: 2, name: "تيشيرتات", image: "/placeholder.svg?height=400&width=300", slug: "t-shirts" },
  { id: 3, name: "بناطيل", image: "/placeholder.svg?height=400&width=300", slug: "pants" },
  { id: 4, name: "بلوزات", image: "/placeholder.svg?height=400&width=300", slug: "blouses" },
]

export default function CategoriesSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group relative overflow-hidden rounded-lg"
        >
          <Image
            src={category.image || "/placeholder.svg"}
            alt={category.name}
            width={300}
            height={400}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
            <h3 className="text-white text-xl font-semibold">{category.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  )
}
