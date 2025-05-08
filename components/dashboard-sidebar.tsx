"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Heart,
  ShoppingCart,
  FileText,
  Home,
  ChevronRight,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarItem {
  title: string
  href: string
  icon: React.ReactNode
  roles: string[]
  submenu?: {
    title: string
    href: string
  }[]
}

const sidebarItems: SidebarItem[] = [
  {
    title: "لوحة التحكم",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
    roles: ["admin", "seller", "customer"],
  },
  {
    title: "الإحصائيات",
    href: "/dashboard/statistics",
    icon: <BarChart3 className="h-5 w-5" />,
    roles: ["admin", "seller"],
  },
  {
    title: "المنتجات",
    href: "/dashboard/products",
    icon: <Package className="h-5 w-5" />,
    roles: ["admin", "seller"],
    submenu: [
      {
        title: "جميع المنتجات",
        href: "/dashboard/products",
      },
      {
        title: "إضافة منتج",
        href: "/dashboard/products/new",
      },
      {
        title: "التصنيفات",
        href: "/dashboard/products/categories",
      },
    ],
  },
  {
    title: "الطلبات",
    href: "/dashboard/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
    roles: ["admin", "seller", "customer"],
  },
  {
    title: "المستخدمين",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
    roles: ["admin"],
  },
  {
    title: "التقارير",
    href: "/dashboard/reports",
    icon: <FileText className="h-5 w-5" />,
    roles: ["admin", "seller"],
  },
  {
    title: "المفضلة",
    href: "/dashboard/wishlist",
    icon: <Heart className="h-5 w-5" />,
    roles: ["customer"],
  },
  {
    title: "سلة التسوق",
    href: "/dashboard/cart",
    icon: <ShoppingCart className="h-5 w-5" />,
    roles: ["customer"],
  },
  {
    title: "الإعدادات",
    href: "/dashboard/settings",
    icon: <Settings className="h-5 w-5" />,
    roles: ["admin", "seller", "customer"],
  },
]

export default function DashboardSidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole))

  return (
    <div className="w-64 border-l bg-white">
      <div className="flex flex-col h-full py-4">
        <nav className="space-y-1 px-2">
          {filteredItems.map((item) => (
            <div key={item.href} className="mb-1">
              {item.submenu ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-right",
                      pathname === item.href && "bg-rose-50 text-rose-600",
                    )}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        {item.icon}
                        <span className="mr-2">{item.title}</span>
                      </div>
                      {openSubmenu === item.title ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  </Button>
                  {openSubmenu === item.title && (
                    <div className="mt-1 mr-4 border-r pr-4 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={cn(
                            "block py-2 px-3 text-sm rounded-md hover:bg-rose-50 hover:text-rose-600",
                            pathname === subitem.href && "bg-rose-50 text-rose-600",
                          )}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-2 px-3 text-sm rounded-md hover:bg-rose-50 hover:text-rose-600",
                    pathname === item.href && "bg-rose-50 text-rose-600",
                  )}
                >
                  {item.icon}
                  <span className="mr-2">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
