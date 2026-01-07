import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockLeads, mockServiceRequests } from '../data/mockData';
import { LayoutDashboard, Users, FileText, Settings, Mail, Phone, Shield, TrendingUp } from 'lucide-react';

export function TherapistDashboard() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-border min-h-screen p-4">
          <div className="mb-8">
            <Link to="/" className="font-semibold text-lg">טיפולנט</Link>
            <p className="text-sm text-muted-foreground mt-1">פאנל מטפל</p>
          </div>
          <nav className="space-y-2">
            <Button variant="default" className="w-full justify-end gap-2">
              <span>סקירה</span>
              <LayoutDashboard className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2">
              <span>פניות ממטופלים</span>
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2">
              <span>שירותים אדמיניסטרטיביים</span>
              <FileText className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2" asChild>
              <Link to="/">
                <span>הפרופיל שלי</span>
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-right">סקירה</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <TrendingUp className="w-8 h-8 text-primary" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">פניות החודש</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <Users className="w-8 h-8 text-accent" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">4</p>
                    <p className="text-sm text-muted-foreground">פניות חדשות השבוע</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div className="text-right">
                    <p className="text-2xl font-bold">2</p>
                    <p className="text-sm text-muted-foreground">בקשות שירות פתוחות</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Call to Action */}
            <Card className="p-6 mb-8 bg-gradient-to-l from-primary/10 to-accent/10 border-primary/20">
              <div className="flex items-center justify-between">
                <Button variant="default">התחל כאן</Button>
                <div className="text-right">
                  <h3 className="font-semibold mb-1">עדיין בלי ביטוח אחריות מקצועית?</h3>
                  <p className="text-sm text-muted-foreground">נעזור לך למצוא את הפוליסה המתאימה</p>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="leads" dir="rtl">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leads">פניות ממטופלים</TabsTrigger>
                <TabsTrigger value="services">שירותים אדמיניסטרטיביים</TabsTrigger>
              </TabsList>

              <TabsContent value="leads" className="mt-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">פעולות</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">הודעה</TableHead>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">שם</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLeads.map((lead) => (
                        <TableRow key={lead.id}>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" asChild>
                                <a href={`mailto:${lead.email}`}>
                                  <Mail className="w-3 h-3" />
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" asChild>
                                <a href={`tel:${lead.phone}`}>
                                  <Phone className="w-3 h-3" />
                                </a>
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                              {lead.status === 'new' ? 'חדש' : 'נוצר קשר'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{lead.message}</TableCell>
                          <TableCell className="text-right">{lead.date}</TableCell>
                          <TableCell className="text-right font-medium">{lead.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <Shield className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2 text-right">ביטוח אחריות מקצועית</h3>
                    <p className="text-sm text-muted-foreground text-right">כיסוי ביטוחי מקיף למטפלים</p>
                  </Card>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <FileText className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2 text-right">פנסיה וקרן השתלמות</h3>
                    <p className="text-sm text-muted-foreground text-right">תכנון פנסיוני וחיסכון לעתיד</p>
                  </Card>
                  <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <FileText className="w-8 h-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2 text-right">דיווח שנתי ומס</h3>
                    <p className="text-sm text-muted-foreground text-right">עזרה בהגשת דוחות ומס</p>
                  </Card>
                </div>

                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">שותף מטפל</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">סוג שירות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockServiceRequests.filter(req => req.therapistName === 'ד"ר רחל כהן').map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="text-right">{request.assignedPartner || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={request.status === 'pending' ? 'outline' : 'secondary'}>
                              {request.status === 'pending' ? 'ממתין' : 'בטיפול'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{request.createdAt}</TableCell>
                          <TableCell className="text-right font-medium">{request.type}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
