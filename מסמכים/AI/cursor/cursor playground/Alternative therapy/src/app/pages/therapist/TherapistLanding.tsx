import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Shield, Users, FileText, TrendingUp, CheckCircle2, ClipboardList, CreditCard, Home } from 'lucide-react';

export function TherapistLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">טיפולנט</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                <a href="#clients" className="text-sm hover:text-primary transition-colors">למטופלים</a>
                <a href="#therapists" className="text-sm text-primary font-medium">למטפלים</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/patient-login" className="text-muted-foreground hover:text-primary">
                  כניסה למטופלים
                </Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/login">כניסה למטפלים</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Right: Text */}
            <div className="space-y-6 text-right order-2 lg:order-1">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                פלטפורמה אחת למטפלים – לקוחות, ביטוח, פנסיה ומס
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                הפלטפורמה שמביאה לך יותר מטופלים מתאימים ומטפלת בכל הצרכים האדמיניסטרטיביים – ביטוח אחריות מקצועית, פנסיה וקרן השתלמות, ודיווחי מס.
              </p>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/login">כניסה למטפלים</Link>
                </Button>
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <Link to="/signup">הצטרפות מטפלים</Link>
                </Button>
              </div>
            </div>

            {/* Left: Dashboard Preview */}
            <div className="relative order-1 lg:order-2">
              <Card className="p-6 bg-white shadow-2xl">
                <div className="space-y-4">
                  {/* Profile Card */}
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="w-12 h-12 rounded-full bg-primary/10"></div>
                    <div className="flex-1 text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="font-semibold">ד"ר רחל כהן</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                          <CheckCircle2 className="w-3 h-3 ml-1" />
                          מאומת
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">פסיכולוגית קלינית ומטפלת NLP</p>
                    </div>
                  </div>

                  {/* Leads List */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 text-right">פניות ממטופלים</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <Badge variant="default" className="text-xs">חדש</Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">שרה לוי</p>
                          <p className="text-xs text-muted-foreground">מעוניינת בטיפול לחרדה</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <Badge variant="outline" className="text-xs">בטיפול</Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">דוד כהן</p>
                          <p className="text-xs text-muted-foreground">שאלה לגבי טיפול זוגי</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Services */}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2 text-right">שירותים אדמיניסטרטיביים</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm justify-end">
                        <span>ביטוח אחריות מקצועית</span>
                        <Shield className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-2 text-sm justify-end">
                        <span>פנסיה וקרן השתלמות</span>
                        <CreditCard className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <Card className="p-8 text-right">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">יותר מטופלים מתאימים</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2 justify-end">
                  <span>פרופיל מקצועי ומאומת</span>
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>חיפוש לפי התמחות ושפה</span>
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>פניות ממטופלים שמחפשים בדיוק אותך</span>
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                </li>
              </ul>
            </Card>

            {/* Benefit 2 */}
            <Card className="p-8 text-right">
              <FileText className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-semibold mb-3">שקט אדמיניסטרטיבי</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2 justify-end">
                  <span>ביטוח אחריות מקצועית</span>
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>פנסיה וקרנות השתלמות</span>
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>סיוע בדיווח שנתי ומס</span>
                  <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                </li>
              </ul>
            </Card>

            {/* Benefit 3 */}
            <Card className="p-8 text-right">
              <TrendingUp className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-3">תמונה אחת של הכל</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2 justify-end">
                  <span>לוח בקרה מרכזי</span>
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>ניהול פניות במקום אחד</span>
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>חיבור לחשבונית ירוקה</span>
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">איך זה עובד למטפלים</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">פותחים פרופיל</h3>
              <p className="text-sm text-muted-foreground">
                רישום פשוט והעלאת תעודות לאימות
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">מקבלים פניות</h3>
              <p className="text-sm text-muted-foreground">
                מטופלים מתאימים יוצרים קשר דרך הפלטפורמה
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">מבקשים סיוע</h3>
              <p className="text-sm text-muted-foreground">
                ביטוח, פנסיה ומס – במקום אחד
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">ממשיכים לטפל בשקט</h3>
              <p className="text-sm text-muted-foreground">
                המערכת דואגת לכל השאר
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-l from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">מוכנים להתחיל?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            הצטרפו לעשרות מטפלים שכבר נהנים מיותר מטופלים ופחות עבודה אדמיניסטרטיבית
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
            <Link to="/signup">הצטרפות מטפלים</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">תנאי שימוש</a>
            <a href="#" className="hover:text-foreground">מדיניות פרטיות</a>
            <a href="#" className="hover:text-foreground">תמיכה</a>
            <a href="#" className="hover:text-foreground">יצירת קשר</a>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            © 2024 טיפולנט. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
