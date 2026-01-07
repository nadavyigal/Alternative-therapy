import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Shield, Users, Search, FileCheck, Headphones } from 'lucide-react';

export function HomePage() {
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
                <Link to="/directory" className="text-sm hover:text-primary transition-colors">מטפלים</Link>
                <Link to="/directory" className="text-sm hover:text-primary transition-colors">מצא מטפל/ת</Link>
                <Link to="/" className="text-sm hover:text-primary transition-colors">איך זה עובד</Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">התחברות</Button>
              <Button asChild size="sm">
                <Link to="/signup">הצטרפות מטפלים</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-right">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-foreground">
                פלטפורמה אמינה למטפלים ולמטופלים בישראל
              </h1>
              <p className="text-xl text-muted-foreground">
                שירות כולל למטפלים אלטרנטיביים - פרופיל מקצועי, קליינטים חדשים, ושירותי תמיכה אדמיניסטרטיביים
              </p>
              <div className="flex gap-4 justify-end">
                <Button variant="outline" size="lg" asChild>
                  <Link to="/directory">אני מחפש/ת מטפל/ת</Link>
                </Button>
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/signup">אני מטפל/ת</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="p-6 bg-white shadow-lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">ד"ר רחל כהן</span>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          <CheckCircle2 className="w-3 h-3 ml-1" />
                          מאומת
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">פסיכולוגית קלינית ומטפלת NLP</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">חרדה</Badge>
                    <Badge variant="outline">דיכאון</Badge>
                    <Badge variant="outline">טראומה</Badge>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">בקשות שירות פעילות</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <FileCheck className="w-4 h-4 text-primary" />
                        <span>ביטוח אחריות מקצועית</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-right">למטפלים</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">יותר מטופלים</h3>
                    <p className="text-sm text-muted-foreground">פרופיל מקצועי הנגיש למי שמחפש את התחום שלך</p>
                  </div>
                  <Users className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">פרופיל מאומת</h3>
                    <p className="text-sm text-muted-foreground">בדיקת תעודות והצגת סמלי אמינות</p>
                  </div>
                  <Shield className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">שירותי תמיכה</h3>
                    <p className="text-sm text-muted-foreground">עזרה עם ביטוח, פנסיה, מס ודיווחים</p>
                  </div>
                  <Headphones className="w-6 h-6 text-primary flex-shrink-0" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-right">למטופלים</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">אמינות ובטיחות</h3>
                    <p className="text-sm text-muted-foreground">מטפלים מאומתים עם תעודות מבוקרות</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0" />
                </div>
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">חיפוש לפי צורך</h3>
                    <p className="text-sm text-muted-foreground">סינון לפי בעיה, גישה, מיקום ושפה</p>
                  </div>
                  <Search className="w-6 h-6 text-accent flex-shrink-0" />
                </div>
                <div className="flex items-start gap-4 text-right">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">מגוון אפשרויות</h3>
                    <p className="text-sm text-muted-foreground">פגישות אישיות וטיפולים מרחוק</p>
                  </div>
                  <Users className="w-6 h-6 text-accent flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">אמינות ובדיקות</h2>
          <p className="text-lg text-muted-foreground mb-8">
            כל מטפל עובר תהליך אימות מסמכים. אנחנו בודקים תעודות, תואר ורישיונות כדי להבטיח אמינות מקסימלית
          </p>
          <Card className="p-6 bg-muted/50 border-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">הצהרת אחריות:</strong> טיפולים אלטרנטיביים אינם מחליפים טיפול רפואי או פסיכיאטרי.
              במקרה של מצב רפואי או נפשי חמור, יש לפנות לשירותי בריאות מוסמכים.
            </p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">אודות</Link>
            <Link to="/" className="hover:text-foreground">תנאי שימוש</Link>
            <Link to="/" className="hover:text-foreground">מדיניות פרטיות</Link>
            <Link to="/" className="hover:text-foreground">צור קשר</Link>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            © 2024 טיפולנט. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
