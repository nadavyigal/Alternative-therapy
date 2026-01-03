"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TherapistSidebar } from "@/components/therapist-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

const STEPS = ["מצב תעסוקתי", "מטרות וחיסכון", "אישור ושליחה"]

export default function PensionRequestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    employmentStatus: "",
    yearsOfExperience: "",
    hasExistingPension: "",
    existingProvider: "",
    goals: [] as string[],
    monthlyAmount: "",
    notes: "",
    consent: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const buildDetails = () => {
    const lines = [
      `סטטוס תעסוקתי: ${formData.employmentStatus || "לא צוין"}`,
      `שנות ניסיון: ${formData.yearsOfExperience || "לא צוין"}`,
      `פנסיה קיימת: ${
        formData.hasExistingPension === "yes"
          ? `כן (${formData.existingProvider || "לא צוין"})`
          : formData.hasExistingPension === "no"
            ? "לא"
            : "לא צוין"
      }`,
      `מטרות מרכזיות: ${formData.goals.join(", ") || "לא צוינו"}`,
      `סכום חודשי מבוקש: ${formData.monthlyAmount || "לא צוין"}`,
    ]

    if (formData.notes.trim()) {
      lines.push(`הערות: ${formData.notes.trim()}`)
    }

    return lines.join("\n")
  }

  const submitRequest = async () => {
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/service-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "pension",
          details: buildDetails(),
          consent: formData.consent,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const message =
          payload?.error === "PROFILE_REQUIRED"
            ? "כדי לשלוח בקשה יש להשלים פרופיל מטפל."
            : payload?.error === "CONSENT_REQUIRED"
              ? "יש לאשר את תנאי ההעברה לפני שליחת הבקשה."
              : payload?.error === "UNAUTHORIZED"
                ? "יש להתחבר כדי לשלוח בקשה."
                : "שליחת הבקשה נכשלה. נסו שוב בעוד רגע."
        setError(message)
        return
      }

      router.push("/dashboard/services?success=pension")
    } catch {
      setError("שליחת הבקשה נכשלה. נסו שוב בעוד רגע.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
      return
    }

    if (formData.consent) {
      await submitRequest()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/dashboard/services")
    }
  }

  const toggleGoal = (goal: string) => {
    if (formData.goals.includes(goal)) {
      setFormData({ ...formData, goals: formData.goals.filter((g) => g !== goal) })
    } else {
      setFormData({ ...formData, goals: [...formData.goals, goal] })
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="בקשה לפנסיה וקרן השתלמות" />
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
                  {currentStep === 0 && "ספרו לנו על המעמד התעסוקתי שלכם"}
                  {currentStep === 1 && "מה המטרות שלכם לחיסכון פנסיוני"}
                  {currentStep === 2 && "בדקו את הפרטים ושלחו את הבקשה"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Employment Status */}
                {currentStep === 0 && (
                  <>
                    <div className="space-y-2">
                      <Label>מה המעמד שלך?</Label>
                      <div className="space-y-2">
                        {["עצמאי בלבד", "שכיר/ה בלבד", "גם וגם"].map((status) => (
                          <div key={status} className="flex items-center gap-3">
                            <input
                              type="radio"
                              id={status}
                              name="employmentStatus"
                              checked={formData.employmentStatus === status}
                              onChange={() => setFormData({ ...formData, employmentStatus: status })}
                              className="w-4 h-4"
                            />
                            <Label htmlFor={status} className="cursor-pointer font-normal">
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="years">כמה שנים את/ה עוסק/ת כמטפל/ת?</Label>
                      <Select
                        value={formData.yearsOfExperience}
                        onValueChange={(value) => setFormData({ ...formData, yearsOfExperience: value })}
                      >
                        <SelectTrigger id="years">
                          <SelectValue placeholder="בחרו שנות ניסיון" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">פחות משנתיים</SelectItem>
                          <SelectItem value="2-5">2-5 שנים</SelectItem>
                          <SelectItem value="5-10">5-10 שנים</SelectItem>
                          <SelectItem value="10+">מעל 10 שנים</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>האם קיימת כבר הפרשה לפנסיה?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.hasExistingPension === "yes" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasExistingPension: "yes" })}
                        >
                          כן
                        </Button>
                        <Button
                          type="button"
                          variant={formData.hasExistingPension === "no" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasExistingPension: "no" })}
                        >
                          לא
                        </Button>
                      </div>
                    </div>

                    {formData.hasExistingPension === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="provider">אצל מי?</Label>
                        <Input
                          id="provider"
                          value={formData.existingProvider}
                          onChange={(e) => setFormData({ ...formData, existingProvider: e.target.value })}
                          className="text-right"
                          placeholder="שם חברת הפנסיה / קופת הגמל"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Step 2: Goals */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-3">
                      <Label>מטרות</Label>
                      <div className="space-y-2">
                        {["עדכון/שיפור של הפנסיה הקיימת", "פתיחת קרן השתלמות", "בדיקת כיסוי ביטוחי נלווה"].map(
                          (goal) => (
                            <div key={goal} className="flex items-center gap-3">
                              <Checkbox
                                id={goal}
                                checked={formData.goals.includes(goal)}
                                onCheckedChange={() => toggleGoal(goal)}
                              />
                              <Label htmlFor={goal} className="cursor-pointer font-normal">
                                {goal}
                              </Label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="monthlyAmount">כמה בערך תרצה/י להפריש בחודש?</Label>
                      <Select
                        value={formData.monthlyAmount}
                        onValueChange={(value) => setFormData({ ...formData, monthlyAmount: value })}
                      >
                        <SelectTrigger id="monthlyAmount">
                          <SelectValue placeholder="בחרו סכום משוער" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500-1000">500-1,000 ₪</SelectItem>
                          <SelectItem value="1000-2000">1,000-2,000 ₪</SelectItem>
                          <SelectItem value="2000-3000">2,000-3,000 ₪</SelectItem>
                          <SelectItem value="3000+">מעל 3,000 ₪</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">העדפות / שיקולים מיוחדים</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="text-right"
                        rows={4}
                        placeholder="יש משהו שחשוב שנדע?"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 2 && (
                  <>
                    <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                      <h3 className="font-semibold mb-4">סיכום הבקשה</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">מעמד תעסוקתי:</div>
                          <div className="font-medium">{formData.employmentStatus || "לא צוין"}</div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">שנות ניסיון:</div>
                          <div className="font-medium">{formData.yearsOfExperience || "לא צוין"}</div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">פנסיה קיימת:</div>
                          <div className="font-medium">
                            {formData.hasExistingPension === "yes"
                              ? `כן - ${formData.existingProvider}`
                              : formData.hasExistingPension === "no"
                                ? "לא"
                                : "לא צוין"}
                          </div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">מטרות:</div>
                          <div className="font-medium">{formData.goals.join(", ") || "לא צוין"}</div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">הפרשה חודשית:</div>
                          <div className="font-medium">{formData.monthlyAmount || "לא צוין"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 leading-relaxed">
                        לאחר שליחת הבקשה, יועץ פנסיוני מורשה יצור איתך קשר תוך 2-3 ימי עסקים להמשך הטיפול ומתן המלצות
                        מותאמות אישית.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                      />
                      <Label htmlFor="consent" className="cursor-pointer font-normal text-sm leading-relaxed">
                        אני מאשר/ת להעביר את הפרטים שלי לגורם פנסיוני מורשה למטרת ייעוץ והצעת תכנית פנסיונית
                      </Label>
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    {currentStep === 0 ? "ביטול" : "חזרה"}
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={isSubmitting || (currentStep === 2 && !formData.consent)}
                  >
                    {currentStep === 2 ? "שליחת בקשה" : "הבא"}
                  </Button>
                </div>
                {error && (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
