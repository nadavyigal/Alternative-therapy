import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet';
import { Search, Phone, Mail, Calendar } from 'lucide-react';

const mockLeads = [
  { id: '1', name: 'שרה לוי', date: '2024-12-27', message: 'שלום, אני מעוניינת בטיפול לחרדה. יש לי ניסיון עם פאניקה ומחפשת מטפלת עם ניסיון בתחום.', status: 'new', phone: '050-1234567', email: 'sarah@example.com', preferredContact: 'phone' },
  { id: '2', name: 'דוד כהן', date: '2024-12-26', message: 'רוצה לברר לגבי אפשרות לטיפול זוגי מרחוק. אשתי ואני מתגוררים בחו"ל.', status: 'contacted', phone: '052-9876543', email: 'david@example.com', preferredContact: 'email' },
  { id: '3', name: 'מיכל אברהם', date: '2024-12-25', message: 'סובלת מכאבי גב כרוניים. מעוניינת בטיפול דיקור סיני.', status: 'scheduled', phone: '054-5551234', email: 'michal@example.com', preferredContact: 'whatsapp' },
  { id: '4', name: 'יוסי מזרחי', date: '2024-12-24', message: 'מחפש מטפל NLP לנושא של ביטחון עצמי.', status: 'contacted', phone: '053-7778899', email: 'yossi@example.com', preferredContact: 'phone' },
];

export function TherapistLeads() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);

  const statusLabels = {
    new: 'חדש',
    contacted: 'יצירת קשר',
    scheduled: 'תואם פגישה',
    closed: 'סגור',
  };

  const filteredLeads = statusFilter === 'all' ? mockLeads : mockLeads.filter(lead => lead.status === statusFilter);

  return (
    <div className="flex min-h-screen bg-background">
      <TherapistSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-right">פניות ממטופלים</h1>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex gap-2">
                <Badge
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter('all')}
                >
                  הכל ({mockLeads.length})
                </Badge>
                <Badge
                  variant={statusFilter === 'new' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter('new')}
                >
                  חדש ({mockLeads.filter(l => l.status === 'new').length})
                </Badge>
                <Badge
                  variant={statusFilter === 'contacted' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter('contacted')}
                >
                  יצירת קשר ({mockLeads.filter(l => l.status === 'contacted').length})
                </Badge>
                <Badge
                  variant={statusFilter === 'scheduled' ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setStatusFilter('scheduled')}
                >
                  תואם פגישה ({mockLeads.filter(l => l.status === 'scheduled').length})
                </Badge>
              </div>

              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="חיפוש לפי שם..." className="pr-10 text-right" />
                </div>
              </div>

              <Select>
                <SelectTrigger className="w-[200px] text-right">
                  <SelectValue placeholder="טווח תאריכים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">השבוע</SelectItem>
                  <SelectItem value="month">החודש</SelectItem>
                  <SelectItem value="all">הכל</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Leads Table */}
          <Card>
            <div className="divide-y">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-center gap-4">
                    <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                      פתח
                    </Button>
                    <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                      {statusLabels[lead.status as keyof typeof statusLabels]}
                    </Badge>
                    <div className="flex-1 text-right">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{lead.message}</p>
                    </div>
                    <div className="text-left text-sm text-muted-foreground">
                      <p>{lead.date}</p>
                      <p className="text-xs">{lead.preferredContact === 'phone' ? '📞' : lead.preferredContact === 'email' ? '✉️' : '💬'} {lead.preferredContact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lead Details Sheet */}
          <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
            <SheetContent side="left" className="w-full sm:max-w-lg">
              {selectedLead && (
                <>
                  <SheetHeader>
                    <SheetTitle className="text-right">פרטי הפנייה</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div className="text-right">
                      <h3 className="font-semibold text-lg mb-1">{selectedLead.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedLead.date}</p>
                    </div>

                    <div className="space-y-2 text-right">
                      <p className="text-sm font-medium">ההודעה:</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedLead.message}
                      </p>
                    </div>

                    <div className="space-y-3 text-right">
                      <p className="text-sm font-medium">פרטי יצירת קשר:</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 justify-end">
                          <a href={`tel:${selectedLead.phone}`} className="text-sm text-primary hover:underline">{selectedLead.phone}</a>
                          <Phone className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <a href={`mailto:${selectedLead.email}`} className="text-sm text-primary hover:underline">{selectedLead.email}</a>
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium mb-2">ערוץ מועדף:</p>
                      <Badge variant="outline">
                        {selectedLead.preferredContact === 'phone' ? 'טלפון' : selectedLead.preferredContact === 'email' ? 'מייל' : 'וואטסאפ'}
                      </Badge>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <p className="text-sm font-medium text-right">פעולות מהירות:</p>
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          <Calendar className="w-4 h-4 ml-2" />
                          סימון כתואם פגישה
                        </Button>
                        <Button className="w-full" variant="outline">
                          סימון כיצירת קשר
                        </Button>
                        <Button className="w-full" variant="ghost">
                          סגירה – לא רלוונטי
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </main>
    </div>
  );
}
