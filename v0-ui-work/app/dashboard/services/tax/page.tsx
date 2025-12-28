"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const STEPS = ["פרטי עסק", "היקף פעילות", "מה צריך ממני"]

export default function TaxRequestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    businessType: "",
    yearsActive: "",
    hasAccountant: "",
    revenue: "",
    hasInvoiceSystem: "",
    invoiceSystemType: "",
    consent: false,
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (formData.consent) {
      router.push("/dashboard/services?success=tax")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/dashboard/services")
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="בקשה לדיווח שנתי ומס" />
        <main className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <Progress value={progress} className="mb-4" />
              <div className="flex justify-between text-sm text-muted-foreground">
                {STEPS.map((step, index) => (
                  <span key={index} className={index === currentStep ? "text-foreground font-medium" : ""}>
                    {step}
                  </span>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep]}</CardTitle>
                <CardDescription>
                  {currentStep === 0 && "ספרו לנו על העסק שלכם"}
                  {currentStep === 1 && "מידע על היקף הפעילות"}
                  {currentStep === 2 && "סיום ושליחת הבקשה"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Business Details */}
                {currentStep === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label>סוג העסק</Label>
                      <div className="space-y-2">
                        {["עוסק פטור", "עוסק מורשה", 'חברה בע"מ'].map((type) => (
                          <div key={type} className="flex items-center gap-3">
                            <input
                              type="radio"
                              id={type}
                              name="businessType"
                              checked={formData.businessType === type}
                              onChange={() => setFormData({ ...formData, businessType: type })}
                              className="w-4 h-4"
                            />
                            <Label htmlFor={type} className="cursor-pointer font-normal">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsActive">שנות פעילות</Label>
                      <Select
                        value={formData.yearsActive}
                        onValueChange={(value) => setFormData({ ...formData, yearsActive: value })}
                      >
                        <SelectTrigger id="yearsActive">
                          <SelectValue placeholder="כמה שנים העסק פעיל" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="first">שנה ראשונה</SelectItem>
                          <SelectItem value="1-3">1-3 שנים</SelectItem>
                          <SelectItem value="3-5">3-5 שנים</SelectItem>
                          <SelectItem value="5+">מעל 5 שנים</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>האם יש לך כיום רואה חשבון / יועץ מס?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.hasAccountant === "yes" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasAccountant: "yes" })}
                        >
                          כן
                        </Button>
                        <Button
                          type="button"
                          variant={formData.hasAccountant === "no" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasAccountant: "no" })}
                        >
                          לא
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Activity Volume */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="revenue">הערכה גסה של מחזור שנתי אחרון</Label>
                      <Select
                        value={formData.revenue}
                        onValueChange={(value) => setFormData({ ...formData, revenue: value })}
                      >
                        <SelectTrigger id="revenue">
                          <SelectValue placeholder="בחרו טווח" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-100k">עד 100,000 ₪</SelectItem>
                          <SelectItem value="100k-250k">100,000-250,000 ₪</SelectItem>
                          <SelectItem value="250k-500k">250,000-500,000 ₪</SelectItem>
                          <SelectItem value="500k+">מעל 500,000 ₪</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>האם יש לך מערכת לניהול חשבוניות?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.hasInvoiceSystem === "yes" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasInvoiceSystem: "yes" })}
                        >
                          כן
                        </Button>
                        <Button
                          type="button"
                          variant={formData.hasInvoiceSystem === "no" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasInvoiceSystem: "no" })}
                        >
                          לא
                        </Button>
                      </div>
                    </div>

                    {formData.hasInvoiceSystem === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="invoiceSystem">איזו מערכת?</Label>
                        <Select
                          value={formData.invoiceSystemType}
                          onValueChange={(value) => setFormData({ ...formData, invoiceSystemType: value })}
                        >
                          <SelectTrigger id="invoiceSystem">
                            <SelectValue placeholder="בחרו מערכת" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="green">חשבונית ירוקה</SelectItem>
                            <SelectItem value="other">אחר</SelectItem>
                          </SelectContent>
                        </Select>
                        {formData.invoiceSystemType === "green" && (
                          <p className="text-sm text-teal-600 mt-2">
                            ניתן יהיה לחבר ישירות לחשבונית ירוקה במסך האינטגרציות
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Step 3: Documents Needed */}
                {currentStep === 2 && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                      <h3 className="font-semibold text-blue-900">מה תצטרכו להכין</h3>
                      <ul className="space-y-2 text-sm text-blue-800">
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>דוחות בנק של השנה החולפת</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>חשבוניות ממוספרות / קבלות</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>הוצאות עסקיות (אם יש)</span>
                        </li>
                        <li className="flex gap-2">
                          <span>•</span>
                          <span>דיווחים קודמים (אם יש)</span>
                        </li>
                      </ul>
                      <p className="text-sm text-blue-700 mt-3">
                        רואה החשבון יעזור לכם לארגן את כל המסמכים הנדרשים אחרי יצירת הקשר
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                      />
                      <Label htmlFor="consent" className="cursor-pointer font-normal text-sm leading-relaxed">
                        אני מאשר/ת להעביר את הפרטים שלי לרואה חשבון/יועץ מס מורשה למטרת סיוע בדיווח שנתי
                      </Label>
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button type="button" variant="outline" onClick={handleBack}>
                    {currentStep === 0 ? "ביטול" : "חזרה"}
                  </Button>
                  <Button onClick={handleNext} disabled={currentStep === 2 && !formData.consent}>
                    {currentStep === 2 ? "שליחת בקשה" : "הבא"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
