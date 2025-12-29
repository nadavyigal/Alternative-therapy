import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Users, FileCheck } from "lucide-react"

export default function TherapistLanding() {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                התחברות
              </Link>
              <Link href="#therapists" className="text-sm font-medium">
                למטפלים
              </Link>
              <Link href="#patients" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                למטופלים
              </Link>
            </div>
            <div className="text-2xl font-bold text-primary">פלטפורמה</div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight text-balance">
              פלטפורמה אחת למטפלים – לקוחות, ביטוח, פנסיה ומס
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              קבלו יותר מטופלים מתאימים, נהלו את כל הצרכים האדמיניסטרטיביים במקום אחד, והתמקדו במה שחשוב באמת – הטיפול.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/signup">הצטרפות מטפלים</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base bg-transparent">
                <Link href="/login">כניסה למטפלים</Link>
              </Button>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">ד.כ</span>
                </div>
                <div>
                  <div className="font-semibold">ד״ר כהן מיכל</div>
                  <div className="text-sm text-teal-600 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>מאומת</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">פניות ממתינות</div>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">שרה לוי</div>
                      <div className="text-xs text-muted-foreground">טיפול בחרדה</div>
                    </div>
                    <div className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">חדש</div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <div className="text-sm font-medium text-teal-900">שירותים אדמיניסטרטיביים</div>
                <div className="text-xs text-teal-700 mt-1">ביטוח • פנסיה • מס</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold">יותר מטופלים מתאימים</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>התאמה אוטומטית לפי תחום ומיקום</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>ניהול פניות ממוקד במקום אחד</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>מעקב אחר סטטוס כל פנייה</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Shield className="w-6 h-6 text-orange-700" />
              </div>
              <h3 className="text-xl font-bold">שקט אדמיניסטרטיבי</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>בקשות לביטוח אחריות מקצועית</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>התאמת פנסיה וקרנות השתלמות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 mt-1">•</span>
                  <span>סיוע בדיווח שנתי למס הכנסה</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold">תמונה אחת של כל מה שקורה</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>דשבורד מרכזי לכל הפעילות</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>חיבור לחשבונית ירוקה</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 mt-1">•</span>
                  <span>דוחות והתראות אוטומטיות</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">איך זה עובד למטפלים</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "פותחים פרופיל", desc: "הרשמה מהירה והעלאת תעודות מקצועיות" },
              { step: "2", title: "מקבלים פניות", desc: "מטופלים מתאימים מגיעים אליכם אוטומטית" },
              { step: "3", title: "מבקשים סיוע", desc: "ביטוח, פנסיה ומס במקום אחד" },
              { step: "4", title: "ממשיכים לטפל בשקט", desc: "התמקדות בטיפול, אנחנו דואגים לשאר" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 font-bold text-lg flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              תנאי שימוש
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              פרטיות
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              תמיכה
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              יצירת קשר
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
