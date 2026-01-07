import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export function InsuranceWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    workLocations: [] as string[],
    clientsPerWeek: '',
    hasExisting: '',
    existingProvider: '',
    coverageAmount: '',
    thirdPartyCoverage: false,
    onlineCoverage: false,
    notes: '',
    consent: false,
  });

  const handleSubmit = () => {
    if (!formData.consent) {
      toast.error('יש לאשר העברת פרטים');
      return;
    }
    toast.success('הבקשה נשלחה בהצלחה! נחזור אליך בקרוב');
    setTimeout(() => navigate('/admin-services'), 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TherapistSidebar />

      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-right">בקשה לביטוח אחריות מקצועית</h1>
          <p className="text-muted-foreground mb-8 text-right">
            מלאו את הפרטים ונחבר אתכם לסוכן ביטוח מורשה
          </p>

          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>שלב {step} מתוך {totalSteps}</span>
              <span className="text-muted-foreground">{((step / totalSteps) * 100).toFixed(0)}%</span>
            </div>
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <Card className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">פרטי פעילות</h2>

                <div className="space-y-3">
                  <Label className="text-right block">איפה את/ה מטפל/ת?</Label>
                  {['קליניקה פרטית', 'בבית המטופל/ת', 'אונליין בלבד', 'מרכז טיפולי / קליניקה משותפת'].map((location) => (
                    <div key={location} className="flex items-center gap-2 justify-end">
                      <Label htmlFor={location} className="cursor-pointer">{location}</Label>
                      <Checkbox
                        id={location}
                        checked={formData.workLocations.includes(location)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, workLocations: [...formData.workLocations, location] });
                          } else {
                            setFormData({ ...formData, workLocations: formData.workLocations.filter(l => l !== location) });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">כמה מטופלים בערך בשבוע?</Label>
                  <Select value={formData.clientsPerWeek} onValueChange={(value) => setFormData({ ...formData, clientsPerWeek: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחר/י טווח" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5">0-5 מטופלים</SelectItem>
                      <SelectItem value="6-10">6-10 מטופלים</SelectItem>
                      <SelectItem value="11-20">11-20 מטופלים</SelectItem>
                      <SelectItem value="20+">מעל 20 מטופלים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">האם יש לך כרגע ביטוח אחריות מקצועית?</Label>
                  <Select value={formData.hasExisting} onValueChange={(value) => setFormData({ ...formData, hasExisting: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחר/י" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">לא</SelectItem>
                      <SelectItem value="yes">כן</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.hasExisting === 'yes' && (
                  <div className="space-y-2">
                    <Label className="text-right block">מי החברה המבטחת?</Label>
                    <Select value={formData.existingProvider} onValueChange={(value) => setFormData({ ...formData, existingProvider: value })}>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="בחר/י" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="harel">הראל</SelectItem>
                        <SelectItem value="migdal">מגדל</SelectItem>
                        <SelectItem value="clal">כלל ביטוח</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">כיסוי מבוקש</h2>

                <div className="space-y-2">
                  <Label className="text-right block">סכום כיסוי רצוי</Label>
                  <Select value={formData.coverageAmount} onValueChange={(value) => setFormData({ ...formData, coverageAmount: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחר/י סכום" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="500k">עד ₪500,000</SelectItem>
                      <SelectItem value="1m">עד ₪1,000,000</SelectItem>
                      <SelectItem value="2m">עד ₪2,000,000</SelectItem>
                      <SelectItem value="custom">סכום אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-end p-4 border rounded-lg">
                    <Label htmlFor="thirdParty" className="cursor-pointer">כיסוי לצד ג' (אם רלוונטי)</Label>
                    <Checkbox
                      id="thirdParty"
                      checked={formData.thirdPartyCoverage}
                      onCheckedChange={(checked) => setFormData({ ...formData, thirdPartyCoverage: checked as boolean })}
                    />
                  </div>

                  <div className="flex items-center gap-2 justify-end p-4 border rounded-lg">
                    <Label htmlFor="online" className="cursor-pointer">הרחבה לטיפול במטופלים אונליין</Label>
                    <Checkbox
                      id="online"
                      checked={formData.onlineCoverage}
                      onCheckedChange={(checked) => setFormData({ ...formData, onlineCoverage: checked as boolean })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-right block">הערות נוספות/דגשים</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="text-right"
                    rows={4}
                    placeholder="יש לך דגשים מיוחדים? כתב/י אותם כאן..."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">אישור ושליחה</h2>

                <Card className="p-4 bg-muted/50">
                  <h3 className="font-medium mb-3 text-right">סיכום הבקשה</h3>
                  <div className="space-y-2 text-sm text-right">
                    <p><strong>מקומות טיפול:</strong> {formData.workLocations.join(', ')}</p>
                    <p><strong>מטופלים בשבוע:</strong> {formData.clientsPerWeek}</p>
                    <p><strong>סכום כיסוי:</strong> {formData.coverageAmount}</p>
                    {formData.thirdPartyCoverage && <p>✓ כיסוי צד ג'</p>}
                    {formData.onlineCoverage && <p>✓ כיסוי טיפולים אונליין</p>}
                  </div>
                </Card>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-right text-blue-900">
                    <strong>הסבר:</strong> לאחר שליחת הבקשה, פרטייך יועברו לסוכן ביטוח מורשה המתמחה בביטוח למטפלים. הסוכן יצור איתך קשר לצורך התאמת הפוליסה המדויקת והצעת מחיר.
                  </p>
                </Card>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  />
                  <Label htmlFor="consent" className="text-sm cursor-pointer text-right">
                    אני מאשר/ת להעביר את הפרטים שלי לסוכן ביטוח מורשה למטרת הצעת ביטוח
                  </Label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {step < totalSteps && (
                  <Button onClick={() => setStep(step + 1)} size="lg">
                    הבא
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                )}
                {step === totalSteps && (
                  <Button onClick={handleSubmit} size="lg">
                    <Check className="w-4 h-4 ml-2" />
                    שליחת בקשה
                  </Button>
                )}
              </div>
              {step > 1 && (
                <Button onClick={() => setStep(step - 1)} variant="outline" size="lg">
                  <ChevronRight className="w-4 h-4 ml-2" />
                  חזרה
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
