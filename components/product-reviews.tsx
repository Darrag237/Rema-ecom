"use client"

import { useState } from "react"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

// Mock reviews data
const reviews = [
  {
    id: 1,
    user: {
      name: "سارة أحمد",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    rating: 5,
    date: "2023-04-15",
    title: "منتج رائع وجودة ممتازة",
    comment:
      "اشتريت هذا الفستان للعيد وكان اختيار موفق جداً. القماش ممتاز والتفصيل دقيق. المقاس مناسب تماماً وأنصح به بشدة.",
    helpful: 12,
    notHelpful: 2,
  },
  {
    id: 2,
    user: {
      name: "نورة محمد",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    rating: 4,
    date: "2023-04-10",
    title: "جميل لكن المقاس أصغر قليلاً",
    comment: "الفستان جميل جداً من ناحية الشكل والخامة، لكن المقاس أصغر قليلاً من المعتاد. أنصح بطلب مقاس أكبر.",
    helpful: 8,
    notHelpful: 1,
  },
  {
    id: 3,
    user: {
      name: "ريم خالد",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    rating: 5,
    date: "2023-04-05",
    title: "تصميم أنيق وخامة ممتازة",
    comment: "أحببت التصميم كثيراً والخامة ممتازة. سعيدة جداً بهذا الشراء وسأطلب ألوان أخرى قريباً.",
    helpful: 15,
    notHelpful: 0,
  },
]

// Calculate rating statistics
const ratingStats = {
  average: 4.5,
  total: reviews.length,
  distribution: [
    { rating: 5, count: 2, percentage: 67 },
    { rating: 4, count: 1, percentage: 33 },
    { rating: 3, count: 0, percentage: 0 },
    { rating: 2, count: 0, percentage: 0 },
    { rating: 1, count: 0, percentage: 0 },
  ],
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [reviewTitle, setReviewTitle] = useState("")

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">{ratingStats.average}</div>
            <div className="flex justify-center mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(ratingStats.average)
                      ? "fill-amber-400 text-amber-400"
                      : i < ratingStats.average
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">بناءً على {ratingStats.total} تقييم</p>
          </div>

          <div className="space-y-2">
            {ratingStats.distribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <span className="w-8 text-sm">{item.rating} ★</span>
                <Progress value={item.percentage} className="h-2" />
                <span className="text-sm text-gray-500">{item.count}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">أضف تقييمك</h3>
            <div className="flex mb-4">
              {[...Array(5)].map((_, i) => (
                <button key={i} onClick={() => setUserRating(i + 1)} className="p-1">
                  <Star className={`w-6 h-6 ${i < userRating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="عنوان التقييم"
                className="w-full p-2 border rounded-md"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
              <Textarea
                placeholder="اكتب تقييمك هنا..."
                className="min-h-[100px]"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <Button className="w-full bg-rose-600 hover:bg-rose-700">إرسال التقييم</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-xl font-medium mb-6">تقييمات العملاء</h3>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{review.user.name}</h4>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <div className="flex my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <h5 className="font-medium mt-2">{review.title}</h5>
                  <p className="text-gray-600 mt-1">{review.comment}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <ThumbsUp className="h-4 w-4 ml-1" />
                      مفيد ({review.helpful})
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <ThumbsDown className="h-4 w-4 ml-1" />
                      غير مفيد ({review.notHelpful})
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
