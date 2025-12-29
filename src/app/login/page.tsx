"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate login
    router.push("/dashboard")
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לדף הבית</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">התחברות למטפלים</h1>
          <p className="text-muted-foreground">כניסה לחשבון המטפל שלך</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="text-right"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="text-right"
              />
              <div className="text-left">
                <Link href="#" className="text-sm text-teal-600 hover:underline">
                  שכחת סיסמה?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              כניסה
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              עדיין לא רשומים?{" "}
              <Link href="/signup" className="text-teal-600 hover:underline font-medium">
                הצטרפות מטפלים
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
