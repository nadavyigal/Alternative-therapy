import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Cable, Check, RefreshCw, Unplug, TrendingUp, FileText } from 'lucide-react';
import { toast } from 'sonner';

export function Integrations() {
  const [greenInvoiceConnected, setGreenInvoiceConnected] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [lastSync, setLastSync] = useState('27.12.2024, 14:30');

  const handleConnect = () => {
    setShowConnectionModal(true);
    // Simulate OAuth flow
    setTimeout(() => {
      setGreenInvoiceConnected(true);
      setShowConnectionModal(false);
      toast.success('חשבונית ירוקה מחוברת בהצלחה!');
    }, 2000);
  };

  const handleDisconnect = () => {
    if (confirm('האם את/ה בטוח/ה שברצונך לנתק את החיבור?')) {
      setGreenInvoiceConnected(false);
      toast.success('החיבור נותק');
    }
  };

  const handleSync = () => {
    toast.success('הסנכרון החל...');
    setTimeout(() => {
      setLastSync(new Date().toLocaleString('he-IL'));
      toast.success('הסנכרון הושלם בהצלחה');
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TherapistSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-right">אינטגרציות וחיבורים</h1>
          <p className="text-muted-foreground mb-8 text-right">
            חברו מערכות קיימות כדי לקבל תמונה מלאה יותר
          </p>

          {/* Green Invoice Card */}
          <Card className="p-8">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4 justify-end">
                  <div className="text-right">
                    <h2 className="text-2xl font-semibold">חשבונית ירוקה</h2>
                    {greenInvoiceConnected ? (
                      <Badge className="mt-1 bg-green-100 text-green-700 border-green-300">
                        <Check className="w-3 h-3 ml-1" />
                        מחובר
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-1">
                        לא מחובר
                      </Badge>
                    )}
                  </div>
                </div>

                {!greenInvoiceConnected ? (
                  // Disconnected State
                  <div className="space-y-4">
                    <p className="text-muted-foreground text-right">
                      חיבור לחשבונית ירוקה מאפשר לראות סיכום הכנסות מהטיפולים במקום אחד.
                      הנתונים מסונכרנים אוטומטית וניתן להשתמש בהם לצורך דיווחי מס.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg text-right">
                      <p className="text-sm text-muted-foreground">
                        <strong className="text-foreground">שימו לב:</strong> החיבור מתבצע דרך חשבון חשבונית ירוקה קיים שלכם. אם עדיין אין לכם חשבון, תוכלו ליצור אחד בחשבונית ירוקה ולחזור לכאן.
                      </p>
                    </div>
                    <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700">
                      <Cable className="w-4 h-4 ml-2" />
                      חיבור לחשבונית ירוקה
                    </Button>
                  </div>
                ) : (
                  // Connected State
                  <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-right">
                      <p className="text-sm text-green-900">
                        ✓ החיבור פעיל. סנכרון אחרון: <strong>{lastSync}</strong>
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="p-4 bg-muted/30">
                        <div className="text-right">
                          <p className="text-2xl font-bold">₪18,450</p>
                          <p className="text-sm text-muted-foreground">סך חשבוניות החודש</p>
                        </div>
                      </Card>
                      <Card className="p-4 bg-muted/30">
                        <div className="text-right">
                          <p className="text-2xl font-bold">23</p>
                          <p className="text-sm text-muted-foreground">חשבוניות החודש</p>
                        </div>
                      </Card>
                    </div>

                    <div className="space-y-2 text-sm text-right">
                      <p className="font-medium">חשבוניות הקשורות לפניות מהפלטפורמה:</p>
                      <p className="text-muted-foreground">8 מתוך 23 חשבוניות החודש (35%)</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                      <Button variant="ghost" onClick={handleDisconnect}>
                        <Unplug className="w-4 h-4 ml-2" />
                        ניתוק חיבור
                      </Button>
                      <Button variant="outline" onClick={handleSync}>
                        <RefreshCw className="w-4 h-4 ml-2" />
                        סנכרון ידני עכשיו
                      </Button>
                    </div>

                    <div className="pt-4 border-t">
                      <Button variant="link" className="text-primary" asChild>
                        <a href="https://www.greeninvoice.co.il" target="_blank" rel="noopener noreferrer">
                          פתיחת חשבונית ירוקה בחלון חדש →
                        </a>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Connection Modal */}
          <Dialog open={showConnectionModal} onOpenChange={setShowConnectionModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-right">מתחבר לחשבונית ירוקה...</DialogTitle>
              </DialogHeader>
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Cable className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  נפתח חלון חדש לכניסה לחשבון חשבונית ירוקה שלך...
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
