import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { TrendingUp, Users, FileText, AlertCircle, Shield, CreditCard, FileCheck, Cable } from 'lucide-react';

export function TherapistDashboard() {
  const recentLeads = [
    { id: '1', name: 'שרה לוי', date: '2024-12-27', subject: 'מעוניינת בטיפול לחרדה', status: 'new' },
    { id: '2', name: 'דוד כהן', date: '2024-12-26', subject: 'שאלה לגבי טיפול זוגי', status: 'contacted' },
    { id: '3', name: 'מיכל אברהם', date: '2024-12-25', subject: 'סובלת מכאבי גב', status: 'scheduled' },
  ];

  const statusLabels = {
    new: 'חדש',
    contacted: 'יצירת קשר',
    scheduled: 'תואם פגישה',
  };

  return (
    <div className="flex min-h-screen">
      <TherapistSidebar />

      <main className="flex-1 p-8 pr-32">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-primary font-bold shadow-sm">ד"ר</div>
              <div className="text-right">
                <p className="font-semibold text-slate-800">ד"ר רחל כהן</p>
                <p className="text-sm text-slate-500">פסיכולוגית קלינית</p>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-right text-slate-800">סקירה</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-primary" />
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">12</p>
                  <p className="text-sm text-muted-foreground">פניות חדשות החודש</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-accent" />
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">7</p>
                  <p className="text-sm text-muted-foreground">פניות פתוחות</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <FileText className="w-8 h-8 text-blue-500" />
                <div className="text-right">
                  <p className="text-3xl font-bold text-slate-800">2</p>
                  <p className="text-sm text-muted-foreground">בקשות שירות פתוחות</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-amber-200/50 bg-amber-50/50 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <AlertCircle className="w-8 h-8 text-amber-600" />
                <div className="text-right">
                  <Badge variant="outline" className="mb-2 border-amber-500 text-amber-700 bg-amber-100/50">
                    ממתין לאימות
                  </Badge>
                  <p className="text-sm text-amber-900">מסמכים בהמתנה</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Leads */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex justify-between items-center mb-4">
                <Button variant="link" className="text-primary hover:text-primary/80" asChild>
                  <Link to="/leads">צפייה בכל הפניות ←</Link>
                </Button>
                <h2 className="text-xl font-semibold text-right text-slate-800">פניות אחרונות ממטופלים</h2>
              </div>

              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center gap-4 p-4 border border-white/40 rounded-2xl bg-white/40 hover:bg-white/60 transition-colors">
                    <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                      {statusLabels[lead.status as keyof typeof statusLabels]}
                    </Badge>
                    <div className="flex-1 text-right">
                      <p className="font-medium text-slate-800">{lead.name}</p>
                      <p className="text-sm text-muted-foreground">{lead.subject}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{lead.date}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Admin Services */}
            <div className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-right text-slate-800">שירותים אדמיניסטרטיביים</h2>
                <div className="space-y-3">
                  <Link to="/admin-services/insurance">
                    <Card className="p-4 hover:shadow-lg hover:bg-white/80 transition-all cursor-pointer border-white/50 bg-white/40">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="text-right">
                          <p className="font-medium text-sm text-slate-800">ביטוח אחריות מקצועית</p>
                          <p className="text-xs text-muted-foreground">כיסוי מקיף למטפלים</p>
                        </div>
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                    </Card>
                  </Link>

                  <Link to="/admin-services/pension">
                    <Card className="p-4 hover:shadow-lg hover:bg-white/80 transition-all cursor-pointer border-white/50 bg-white/40">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="text-right">
                          <p className="font-medium text-sm text-slate-800">פנסיה וקרן השתלמות</p>
                          <p className="text-xs text-muted-foreground">תכנון פנסיוני לעצמאיים</p>
                        </div>
                        <CreditCard className="w-6 h-6 text-primary" />
                      </div>
                    </Card>
                  </Link>

                  <Link to="/admin-services/tax">
                    <Card className="p-4 hover:shadow-lg hover:bg-white/80 transition-all cursor-pointer border-white/50 bg-white/40">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="text-right">
                          <p className="font-medium text-sm text-slate-800">דיווח שנתי ומס</p>
                          <p className="text-xs text-muted-foreground">עזרה בדיווחים למס</p>
                        </div>
                        <FileCheck className="w-6 h-6 text-primary" />
                      </div>
                    </Card>
                  </Link>
                </div>

                <Button variant="outline" className="w-full mt-4 bg-white/50 border-white/60 hover:bg-white/80" asChild>
                  <Link to="/admin-services">צפייה בכל השירותים</Link>
                </Button>
              </Card>

              {/* Green Invoice Integration */}
              <Card className="p-6 bg-gradient-to-br from-green-50/60 to-emerald-50/60 border-green-200/50 backdrop-blur-md">
                <div className="flex items-center gap-3 mb-3 justify-end">
                  <h3 className="font-semibold text-right text-slate-800">חיבור לחשבונית ירוקה</h3>
                  <Cable className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 text-right">
                  סנכרנו נתונים על חשבוניות מטיפולים – במקום אחד
                </p>
                <Button className="w-full bg-green-600/90 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 border-none" asChild>
                  <Link to="/integrations">חיבור לחשבונית ירוקה</Link>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
