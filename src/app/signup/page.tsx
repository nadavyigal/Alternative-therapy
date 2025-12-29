"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    agreedToTerms: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate signup
    router.push("/onboarding")
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לדף הבית</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">פתיחת חשבון מטפל/ת</h1>
          <p className="text-muted-foreground">הצטרפו לרשת המטפלים שלנו</p>
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
              <Label htmlFor="phone">טלפון נייד</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="text-right"
                placeholder="05X-XXXXXXX"
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
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                אני מאשר/ת את{" "}
                <Link href="#" className="text-teal-600 hover:underline">
                  תנאי השימוש
                </Link>{" "}
                ו
                <Link href="#" className="text-teal-600 hover:underline">
                  מדיניות הפרטיות
                </Link>
              </Label>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={!formData.agreedToTerms}>
              המשך
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              כבר רשומים?{" "}
              <Link href="/login" className="text-teal-600 hover:underline font-medium">
                התחברות
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
