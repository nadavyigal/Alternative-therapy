"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Upload, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const STEPS = ["????? ??????", "????? ?????", "????? ????? ???? ???", "????? ?????", "?????? ???????", "????"]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    phoneVerified: false,
    title: "",
    experience: "",
    profileImage: null as File | null,
    specialties: [] as string[],
    issues: [] as string[],
    audiences: [] as string[],
    hasClinic: false,
    hasOnline: false,
    city: "",
    languages: [] as string[],
    documents: [] as Array<{ file: File; name: string; type: string; issuer: string; date: string }>,
  })
  const [otpCode, setOtpCode] = useState("")
  const [otpStatus, setOtpStatus] = useState<
    "idle" | "sending" | "sent" | "verifying" | "verified" | "error"
  >("idle")
  const [otpError, setOtpError] = useState<string | null>(null)

  const handleNext = () => {
    if (currentStep === 1 && !formData.phoneVerified) {
      setOtpError("?? ???? ?? ???? ?????? ??? ??????.")
      return
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push("/dashboard")
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleArrayItem = (key: string, value: string) => {
    const array = formData[key as keyof typeof formData] as string[]
    if (array.includes(value)) {
      setFormData({ ...formData, [key]: array.filter((item) => item !== value) })
    } else {
      setFormData({ ...formData, [key]: [...array, value] })
    }
  }

  const handleSendOtp = async () => {
    setOtpError(null)
    setOtpStatus("sending")

    try {
      const response = await fetch("/api/phone-verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error ?? "SEND_FAILED")
      }

      setFormData((prev) => ({ ...prev, phone: data?.phone ?? prev.phone, phoneVerified: false }))
      setOtpCode("")
      setOtpStatus("sent")
    } catch {
      setOtpStatus("error")
      setOtpError("?? ?????? ????? ???. ??? ???.")
    }
  }

  const handleVerifyOtp = async () => {
    setOtpError(null)
    setOtpStatus("verifying")

    try {
      const response = await fetch("/api/phone-verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: formData.phone, code: otpCode }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok || !data?.verified) {
        throw new Error(data?.error ?? "INVALID_OTP")
      }

      setFormData((prev) => ({ ...prev, phone: data?.phone ?? prev.phone, phoneVerified: true }))
      setOtpStatus("verified")
    } catch {
      setOtpStatus("error")
      setOtpError("??? ?? ???? ?? ??? ?????.")
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">אשף הרשמה</h1>
            <span className="text-sm text-muted-foreground">
              שלב {currentStep + 1} מתוך {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap ${
                  index === currentStep
                    ? "bg-teal-100 text-teal-900 font-medium"
                    : index < currentStep
                      ? "bg-muted text-muted-foreground"
                      : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {index < currentStep && <CheckCircle2 className="w-4 h-4" />}
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Info Panel */}
          <div className="lg:col-span-1">
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 sticky top-8">
              <h3 className="font-bold text-teal-900 mb-3">
                {currentStep === 0 && "זה מה שהמטופלים יראו עליך ראשונים"}
                {currentStep === 1 && "?????? ???? ????? ??? ?????? ?? ??????"}
                {currentStep === 2 && "עזרו למטופלים למצוא אתכם"}
                {currentStep === 3 && "היכן ובאילו שפות אתם מטפלים"}
                {currentStep === 4 && "אימות מקצועי"}
                {currentStep === 5 && "הפרופיל שלך מוכן!"}
              </h3>
              <ul className="space-y-2 text-sm text-teal-800">
                {currentStep === 0 && (
                  <>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>כתבו כותרת מקצועית ברורה</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>תמונה מקצועית מגדילה אמון</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>ציינו את ניסיונכם בתחום</span>
                    </li>
                  </>
                )}
                {currentStep === 1 && (
                  <>
                    <li className="flex gap-2">
                      <span>?</span>
                      <span>???? ??? ????? ?-SMS ????? ???</span>
                    </li>
                    <li className="flex gap-2">
                      <span>?</span>
                      <span>????? ???? ???? ????? ??????</span>
                    </li>
                    <li className="flex gap-2">
                      <span>?</span>
                      <span>???? ???? ??? ??? ?? ????</span>
                    </li>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>בחרו תחומי טיפול רלוונטיים</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>ציינו נושאים שאתם מתמחים בהם</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>סמנו את קהל היעד המתאים</span>
                    </li>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>ציינו אם אתם מקבלים בקליניקה</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>סמנו אם אתם מציעים טיפול מרחוק</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>בחרו את כל השפות שבהן אתם מטפלים</span>
                    </li>
                  </>
                )}
                {currentStep === 4 && (
                  <>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>העלו תעודות והסמכות מקצועיות</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>הצוות יבדוק את המסמכים תוך 2-3 ימים</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>פרופיל מאומת מגדיל אמון ופניות</span>
                    </li>
                  </>
                )}
                {currentStep === 5 && (
                  <>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>הפרופיל שלך כמעט מוכן</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>בינתיים יופיע כ"ממתין לאימות"</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span>תקבלו התראה כשהאימות יושלם</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Form Panel */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8">
              {/* Step 1: Personal Details */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-6">פרטים אישיים</h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">שם פרטי</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="text-right"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">שם משפחה</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">כותרת מקצועית</Label>
                    <Input
                      id="title"
                      placeholder="לדוגמה: פסיכולוג/ית קלינית, מטפל/ת במוזיקה, רפלקסולוג/ית"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">ניסיון מקצועי</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger id="experience">
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

                  <div className="space-y-2">
                    <Label>תמונת פרופיל</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-teal-300 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">גררו לכאן תמונה או לחצו להעלאה</p>
                      <input type="file" accept="image/*" className="hidden" id="profile-image" />
                      <label htmlFor="profile-image">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>בחירת תמונה</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Phone Verification */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-6">????? ???? ?????</h2>
                  <div className="space-y-2">
                    <Label htmlFor="phone">???? ?????</Label>
                    <Input
                      id="phone"
                      placeholder="050-123-4567"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value
                        setFormData((prev) => ({
                          ...prev,
                          phone: value,
                          phoneVerified: false,
                        }))
                        setOtpStatus("idle")
                        setOtpError(null)
                      }}
                      className="text-right"
                    />
                    <p className="text-sm text-muted-foreground">
                      ???? ???? ??? ????? ?-SMS ??? ??????.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!formData.phone || otpStatus === "sending" || otpStatus === "verifying" || formData.phoneVerified}
                    >
                      {otpStatus === "sending" ? "????..." : "??? ??? ?????"}
                    </Button>
                    {formData.phoneVerified && (
                      <span className="text-sm text-teal-700">???? ?????? ????.</span>
                    )}
                  </div>

                  {(otpStatus === "sent" || otpStatus === "verifying" || otpStatus === "error") && !formData.phoneVerified && (
                    <div className="space-y-2">
                      <Label htmlFor="otpCode">??? ?????</Label>
                      <Input
                        id="otpCode"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        className="text-right"
                      />
                      <Button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={!otpCode || otpStatus === "verifying"}
                      >
                        {otpStatus === "verifying" ? "????..." : "??? ???"}
                      </Button>
                    </div>
                  )}

                  {otpError && (
                    <p className="text-sm text-destructive">{otpError}</p>
                  )}
                </div>
              )}
              {/* Step 3: Specialties */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-6">תחומי טיפול וקהל יעד</h2>

                  <div className="space-y-2">
                    <Label>תחומי טיפול</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "פסיכולוגיה",
                        "CBT",
                        "NLP",
                        "דיקור סיני",
                        "רייקי",
                        "עיסוי רפואי",
                        "יוגה טיפולית",
                        "רפלקסולוגיה",
                      ].map((specialty) => (
                        <Badge
                          key={specialty}
                          variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2"
                          onClick={() => toggleArrayItem("specialties", specialty)}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>נושאים ובעיות</Label>
                    <div className="flex flex-wrap gap-2">
                      {["חרדה", "דיכאון", "כאב כרוני", "פוריות", "טראומה", "מערכות יחסים", "הפרעות אכילה", "ADHD"].map(
                        (issue) => (
                          <Badge
                            key={issue}
                            variant={formData.issues.includes(issue) ? "default" : "outline"}
                            className="cursor-pointer px-4 py-2"
                            onClick={() => toggleArrayItem("issues", issue)}
                          >
                            {issue}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>קהל יעד</Label>
                    <div className="flex flex-wrap gap-2">
                      {["ילדים", "נוער", "מבוגרים", "זוגות", "הורים", "קשישים"].map((audience) => (
                        <Badge
                          key={audience}
                          variant={formData.audiences.includes(audience) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2"
                          onClick={() => toggleArrayItem("audiences", audience)}
                        >
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Location */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-6">מיקום ושפות</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <div className="font-medium">אני מקבל/ת מטופלים בקליניקה</div>
                        <div className="text-sm text-muted-foreground">טיפול פנים אל פנים</div>
                      </div>
                      <Button
                        type="button"
                        variant={formData.hasClinic ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, hasClinic: !formData.hasClinic })}
                      >
                        {formData.hasClinic ? "כן" : "לא"}
                      </Button>
                    </div>

                    {formData.hasClinic && (
                      <div className="grid md:grid-cols-2 gap-4 pr-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">עיר</Label>
                          <Select
                            value={formData.city}
                            onValueChange={(value) => setFormData({ ...formData, city: value })}
                          >
                            <SelectTrigger id="city">
                              <SelectValue placeholder="בחרו עיר" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tel-aviv">תל אביב</SelectItem>
                              <SelectItem value="jerusalem">ירושלים</SelectItem>
                              <SelectItem value="haifa">חיפה</SelectItem>
                              <SelectItem value="beer-sheva">באר שבע</SelectItem>
                              <SelectItem value="netanya">נתניה</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <div className="font-medium">אני מציע/ת טיפולים מרחוק</div>
                        <div className="text-sm text-muted-foreground">זום, טלפון או וידאו</div>
                      </div>
                      <Button
                        type="button"
                        variant={formData.hasOnline ? "default" : "outline"}
                        onClick={() => setFormData({ ...formData, hasOnline: !formData.hasOnline })}
                      >
                        {formData.hasOnline ? "כן" : "לא"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>שפות</Label>
                    <div className="flex flex-wrap gap-2">
                      {["עברית", "אנגלית", "רוסית", "ערבית", "צרפתית", "אמהרית"].map((language) => (
                        <Badge
                          key={language}
                          variant={formData.languages.includes(language) ? "default" : "outline"}
                          className="cursor-pointer px-4 py-2"
                          onClick={() => toggleArrayItem("languages", language)}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Documents */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold mb-6">מסמכים ואימות</h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
                    <p className="font-medium mb-1">למה צריך תעודות?</p>
                    <p>
                      הצוות שלנו יבדוק את המסמכים וסימן "מאומת" יופיע בפרופיל שלך. זה מגדיל משמעותית את האמון של
                      מטופלים.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-teal-300 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">גררו לכאן קבצי PDF/JPG או לחצו להעלאה</p>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" id="documents" />
                      <label htmlFor="documents">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <span>בחירת קבצים</span>
                        </Button>
                      </label>
                    </div>

                    {formData.documents.length > 0 && (
                      <div className="space-y-3">
                        {formData.documents.map((doc, index) => (
                          <div key={index} className="border border-border rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="text-sm font-medium">{doc.file.name}</div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newDocs = formData.documents.filter((_, i) => i !== index)
                                  setFormData({ ...formData, documents: newDocs })
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">שם התעודה</Label>
                                <Input placeholder="לדוגמה: תואר ראשון בפסיכולוגיה" className="text-right text-sm" />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">סוג</Label>
                                <Select>
                                  <SelectTrigger className="text-sm">
                                    <SelectValue placeholder="בחרו סוג" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="certificate">תעודת מטפל/ת</SelectItem>
                                    <SelectItem value="degree">תואר אקדמי</SelectItem>
                                    <SelectItem value="license">רישיון מקצועי</SelectItem>
                                    <SelectItem value="other">אחר</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-2">
                              <Badge variant="secondary" className="text-xs">
                                בהמתנה לבדיקה
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Complete */}
              {currentStep === 5 && (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-teal-600" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">הפרופיל שלך כמעט מוכן!</h2>
                    <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                      אנחנו בודקים את המסמכים, ובינתיים הפרופיל יופיע כ"ממתין לאימות". בדרך כלל זה לוקח 2-3 ימי עסקים.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-6 max-w-md mx-auto text-right">
                    <h3 className="font-semibold mb-3">מה קורה עכשיו?</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>הפרופיל שלך זמין ללוח הבקרה</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>תוכלו לראות ולערוך את הפרטים</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                        <span>נשלח התראה כשהאימות יושלם</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-border">
                <div className="flex gap-3">
                  {currentStep > 0 && currentStep < STEPS.length - 1 && (
                    <Button type="button" variant="outline" onClick={handleBack}>
                      חזרה
                    </Button>
                  )}
                  {currentStep < STEPS.length - 1 && (
                    <Button type="button" variant="ghost" className="text-muted-foreground" disabled={currentStep === 1}>
                      שמירה ויציאה
                    </Button>
                  )}
                </div>
                <Button onClick={handleNext}>{currentStep === STEPS.length - 1 ? "כניסה ללוח הבקרה" : "הבא"}</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
