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

const STEPS = ["פרטי פעילות", "כיסוי מבוקש", "אישור ושליחה"]

export default function InsuranceRequestPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    locations: [] as string[],
    patientsPerWeek: "",
    hasCurrentInsurance: "",
    currentInsurer: "",
    coverageAmount: "",
    thirdPartyCoverage: false,
    onlineCoverage: false,
    notes: "",
    consent: false,
  })

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else if (formData.consent) {
      // Submit form
      router.push("/dashboard/services?success=insurance")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push("/dashboard/services")
    }
  }

  const toggleLocation = (location: string) => {
    if (formData.locations.includes(location)) {
      setFormData({ ...formData, locations: formData.locations.filter((l) => l !== location) })
    } else {
      setFormData({ ...formData, locations: [...formData.locations, location] })
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div dir="rtl" className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <div className="flex-1">
        <DashboardHeader title="בקשה לביטוח אחריות מקצועית" />
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
                  {currentStep === 0 && "ספרו לנו על הפעילות המקצועית שלכם"}
                  {currentStep === 1 && "איזה כיסוי ביטוחי תרצו לקבל"}
                  {currentStep === 2 && "בדקו את הפרטים ושלחו את הבקשה"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Activity Details */}
                {currentStep === 0 && (
                  <>
                    <div className="space-y-3">
                      <Label>איפה את/ה מטפל/ת?</Label>
                      <div className="space-y-2">
                        {["קליניקה פרטית", "בבית המטופל/ת", "אונליין בלבד", "מרכז טיפולי / קליניקה משותפת"].map(
                          (location) => (
                            <div key={location} className="flex items-center gap-3">
                              <Checkbox
                                id={location}
                                checked={formData.locations.includes(location)}
                                onCheckedChange={() => toggleLocation(location)}
                              />
                              <Label htmlFor={location} className="cursor-pointer font-normal">
                                {location}
                              </Label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="patientsPerWeek">כמה מטופלים בערך בשבוע?</Label>
                      <Select
                        value={formData.patientsPerWeek}
                        onValueChange={(value) => setFormData({ ...formData, patientsPerWeek: value })}
                      >
                        <SelectTrigger id="patientsPerWeek">
                          <SelectValue placeholder="בחרו טווח" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 מטופלים</SelectItem>
                          <SelectItem value="6-10">6-10 מטופלים</SelectItem>
                          <SelectItem value="11-20">11-20 מטופלים</SelectItem>
                          <SelectItem value="20+">מעל 20 מטופלים</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>האם יש לך כרגע ביטוח אחריות מקצועית?</Label>
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant={formData.hasCurrentInsurance === "yes" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasCurrentInsurance: "yes" })}
                        >
                          כן
                        </Button>
                        <Button
                          type="button"
                          variant={formData.hasCurrentInsurance === "no" ? "default" : "outline"}
                          onClick={() => setFormData({ ...formData, hasCurrentInsurance: "no" })}
                        >
                          לא
                        </Button>
                      </div>
                    </div>

                    {formData.hasCurrentInsurance === "yes" && (
                      <div className="space-y-2">
                        <Label htmlFor="currentInsurer">מי החברה המבטחת?</Label>
                        <Input
                          id="currentInsurer"
                          value={formData.currentInsurer}
                          onChange={(e) => setFormData({ ...formData, currentInsurer: e.target.value })}
                          className="text-right"
                          placeholder="שם חברת הביטוח"
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Step 2: Coverage */}
                {currentStep === 1 && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="coverageAmount">סכום כיסוי רצוי</Label>
                      <Select
                        value={formData.coverageAmount}
                        onValueChange={(value) => setFormData({ ...formData, coverageAmount: value })}
                      >
                        <SelectTrigger id="coverageAmount">
                          <SelectValue placeholder="בחרו סכום כיסוי" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500k">עד 500,000 ₪</SelectItem>
                          <SelectItem value="1m">עד 1,000,000 ₪</SelectItem>
                          <SelectItem value="2m">עד 2,000,000 ₪</SelectItem>
                          <SelectItem value="custom">אחר - צריך ייעוץ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="thirdParty"
                          checked={formData.thirdPartyCoverage}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, thirdPartyCoverage: checked as boolean })
                          }
                        />
                        <Label htmlFor="thirdParty" className="cursor-pointer font-normal">
                          כיסוי לצד ג' (אם רלוונטי)
                        </Label>
                      </div>

                      <div className="flex items-center gap-3">
                        <Checkbox
                          id="online"
                          checked={formData.onlineCoverage}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, onlineCoverage: checked as boolean })
                          }
                        />
                        <Label htmlFor="online" className="cursor-pointer font-normal">
                          הרחבה לטיפול במטופלים אונליין
                        </Label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">הערות נוספות / דגשים</Label>
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
                          <div className="text-muted-foreground mb-1">מיקומי טיפול:</div>
                          <div className="font-medium">{formData.locations.join(", ") || "לא צוין"}</div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">מטופלים בשבוע:</div>
                          <div className="font-medium">{formData.patientsPerWeek || "לא צוין"}</div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">ביטוח קיים:</div>
                          <div className="font-medium">
                            {formData.hasCurrentInsurance === "yes"
                              ? `כן - ${formData.currentInsurer}`
                              : formData.hasCurrentInsurance === "no"
                                ? "לא"
                                : "לא צוין"}
                          </div>
                        </div>

                        <div>
                          <div className="text-muted-foreground mb-1">סכום כיסוי:</div>
                          <div className="font-medium">{formData.coverageAmount || "לא צוין"}</div>
                        </div>

                        {formData.notes && (
                          <div>
                            <div className="text-muted-foreground mb-1">הערות:</div>
                            <div className="font-medium">{formData.notes}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900 leading-relaxed">
                        לאחר שליחת הבקשה, סוכן ביטוח מורשה יצור איתך קשר תוך 2-3 ימי עסקים להמשך הטיפול ומתן הצעת מחיר
                        מפורטת.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="consent"
                        checked={formData.consent}
                        onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                      />
                      <Label htmlFor="consent" className="cursor-pointer font-normal text-sm leading-relaxed">
                        אני מאשר/ת להעביר את הפרטים שלי לסוכן ביטוח מורשה למטרת הצעת ביטוח
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
