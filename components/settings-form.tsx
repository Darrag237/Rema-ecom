"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Moon, Sun, BellRing, BellOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"

export default function SettingsForm() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    theme: theme || "light",
    notifications: {
      email: true,
      orders: true,
      marketing: false,
    },
    language: "ar",
  })

  const handleThemeChange = (value: string) => {
    setSettings((prev) => ({ ...prev, theme: value }))
    setTheme(value)
  }

  const handleNotificationChange = (key: keyof typeof settings.notifications) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const handleLanguageChange = (value: string) => {
    setSettings((prev) => ({ ...prev, language: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // في التطبيق الحقيقي، هنا سيتم إرسال الإعدادات إلى الخادم
      // await fetch("/api/users/settings", {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(settings),
      // })

      // محاكاة تأخير الشبكة
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ إعدادات حسابك بنجاح",
      })
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>المظهر</CardTitle>
            <CardDescription>تخصيص مظهر التطبيق</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={settings.theme} onValueChange={handleThemeChange} className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="flex items-center">
                  <Sun className="ml-2 h-5 w-5" />
                  فاتح
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="flex items-center">
                  <Moon className="ml-2 h-5 w-5" />
                  داكن
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system">تلقائي (حسب إعدادات النظام)</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>الإشعارات</CardTitle>
            <CardDescription>إدارة إعدادات الإشعارات</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BellRing className="h-5 w-5" />
                <Label htmlFor="notifications-email">إشعارات البريد الإلكتروني</Label>
              </div>
              <Switch
                id="notifications-email"
                checked={settings.notifications.email}
                onCheckedChange={() => handleNotificationChange("email")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BellRing className="h-5 w-5" />
                <Label htmlFor="notifications-orders">إشعارات الطلبات</Label>
              </div>
              <Switch
                id="notifications-orders"
                checked={settings.notifications.orders}
                onCheckedChange={() => handleNotificationChange("orders")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 space-x-reverse">
                <BellOff className="h-5 w-5" />
                <Label htmlFor="notifications-marketing">إشعارات تسويقية</Label>
              </div>
              <Switch
                id="notifications-marketing"
                checked={settings.notifications.marketing}
                onCheckedChange={() => handleNotificationChange("marketing")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>اللغة</CardTitle>
            <CardDescription>تغيير لغة التطبيق</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={settings.language} onValueChange={handleLanguageChange} className="space-y-4">
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="ar" id="lang-ar" />
                <Label htmlFor="lang-ar">العربية</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">English</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ الإعدادات"
          )}
        </Button>
      </div>
    </form>
  )
}
