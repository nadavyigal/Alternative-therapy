import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { mockTherapists, mockCredentials, mockServiceRequests } from '../data/mockData';
import { LayoutDashboard, Users, FileCheck, FileText, Settings, CheckCircle2, XCircle, Clock } from 'lucide-react';

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-l border-border min-h-screen p-4">
          <div className="mb-8">
            <Link to="/" className="font-semibold text-lg">טיפולנט</Link>
            <p className="text-sm text-muted-foreground mt-1">פאנל אדמין</p>
          </div>
          <nav className="space-y-2">
            <Button variant="default" className="w-full justify-end gap-2">
              <span>סקירה כללית</span>
              <LayoutDashboard className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2">
              <span>מטפלים</span>
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2">
              <span>מסמכים ותעודות</span>
              <FileCheck className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2">
              <span>בקשות שירות</span>
              <FileText className="w-4 h-4" />
            </Button>
            <Button variant="ghost" className="w-full justify-end gap-2">
              <span>הגדרות</span>
              <Settings className="w-4 h-4" />
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-right">סקירה כללית</h1>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="text-right">
                  <p className="text-2xl font-bold">{mockTherapists.length}</p>
                  <p className="text-sm text-muted-foreground">מטפלים רשומים</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-right">
                  <p className="text-2xl font-bold">{mockTherapists.filter(t => t.verified).length}</p>
                  <p className="text-sm text-muted-foreground">פרופילים מפורסמים</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-right">
                  <p className="text-2xl font-bold">{mockCredentials.filter(c => c.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">תעודות ממתינות</p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="text-right">
                  <p className="text-2xl font-bold">{mockServiceRequests.length}</p>
                  <p className="text-sm text-muted-foreground">בקשות שירות</p>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="therapists" dir="rtl">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="therapists">מטפלים</TabsTrigger>
                <TabsTrigger value="credentials">מסמכים</TabsTrigger>
                <TabsTrigger value="services">בקשות שירות</TabsTrigger>
              </TabsList>

              <TabsContent value="therapists" className="mt-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">פעולות</TableHead>
                        <TableHead className="text-right">תעודות</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">אימייל</TableHead>
                        <TableHead className="text-right">שם</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTherapists.map((therapist) => (
                        <TableRow key={therapist.id}>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              עריכה
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant={therapist.verified ? 'default' : 'outline'}>
                              {therapist.verified ? 'מאומת' : 'ממתין'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">פורסם</Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm text-muted-foreground">
                            {therapist.name.toLowerCase().replace(/\s+/g, '.')}@example.com
                          </TableCell>
                          <TableCell className="text-right font-medium">{therapist.name}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="credentials" className="mt-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">פעולות</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">מוסד</TableHead>
                        <TableHead className="text-right">סוג מסמך</TableHead>
                        <TableHead className="text-right">מטפל/ת</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCredentials.map((credential) => (
                        <TableRow key={credential.id}>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={credential.status === 'verified' ? 'default' : 'outline'}
                              className={credential.status === 'pending' ? 'border-amber-500 text-amber-700' : ''}
                            >
                              {credential.status === 'verified' ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3 ml-1" />
                                  מאומת
                                </>
                              ) : (
                                <>
                                  <Clock className="w-3 h-3 ml-1" />
                                  ממתין
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{credential.issuer}</TableCell>
                          <TableCell className="text-right">{credential.documentType}</TableCell>
                          <TableCell className="text-right font-medium">{credential.therapistName}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">פעולות</TableHead>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">שותף מטפל</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">סוג שירות</TableHead>
                        <TableHead className="text-right">מטפל/ת</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockServiceRequests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <Button size="sm" variant="outline">
                              שיוך שותף
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">{request.createdAt}</TableCell>
                          <TableCell className="text-right">{request.assignedPartner || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={request.status === 'pending' ? 'outline' : 'secondary'}>
                              {request.status === 'pending' ? 'ממתין' : 'בטיפול'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">{request.type}</TableCell>
                          <TableCell className="text-right font-medium">{request.therapistName}</TableCell>
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
