import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Shield, CreditCard, FileCheck, ArrowLeft } from 'lucide-react';

const activeRequests = [
  { id: '1', type: 'ביטוח אחריות מקצועית', status: 'new', date: '2024-12-20', partner: '' },
  { id: '2', type: 'פנסיה וקרן השתלמות', status: 'inProgress', date: '2024-12-15', partner: 'הפניקס' },
];

export function AdminServicesHub() {
  const statusLabels = {
    new: 'חדש',
    inProgress: 'בטיפול',
    needsInfo: 'דרוש מידע',
    completed: 'הושלם',
    closed: 'נסגר',
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TherapistSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-right">שירותים אדמיניסטרטיביים</h1>
          <p className="text-muted-foreground mb-8 text-right">
            ביטוח, פנסיה ומס – עם גורמים מקצועיים מורשים
          </p>

          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link to="/admin-services/insurance">
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-right">ביטוח אחריות מקצועית</h3>
                <p className="text-sm text-muted-foreground mb-4 text-right">
                  ביטוח אחריות מקצועית למטפלים – מותאם לתחום הפעילות שלך
                </p>
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  פתיחת בקשת ביטוח
                </Button>
              </Card>
            </Link>

            <Link to="/admin-services/pension">
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                <CreditCard className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-right">פנסיות וקרנות השתלמות</h3>
                <p className="text-sm text-muted-foreground mb-4 text-right">
                  התאמת פנסיה וקרנות השתלמות לעצמאיים ולמטפלים
                </p>
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  פתיחת בקשת פנסיה
                </Button>
              </Card>
            </Link>

            <Link to="/admin-services/tax">
              <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full">
                <FileCheck className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-right">דיווח שנתי ומס</h3>
                <p className="text-sm text-muted-foreground mb-4 text-right">
                  עזרה בדיווח שנתי למס הכנסה וניהול ספרים
                </p>
                <Button className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  פתיחת בקשת מס
                </Button>
              </Card>
            </Link>
          </div>

          {/* Active Requests */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-right">בקשות פעילות</h2>
            <div className="space-y-3">
              {activeRequests.map((request) => (
                <div key={request.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <Badge variant={request.status === 'new' ? 'default' : 'secondary'}>
                    {statusLabels[request.status as keyof typeof statusLabels]}
                  </Badge>
                  <div className="flex-1 text-right">
                    <p className="font-medium">{request.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.partner ? `גורם מטפל: ${request.partner}` : 'טרם שובץ'}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">{request.date}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
