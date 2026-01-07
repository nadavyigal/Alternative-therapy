import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Progress } from '../../components/ui/progress';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export function TaxWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    businessType: '',
    yearsActive: '',
    hasAccountant: '',
    annualRevenue: '',
    hasInvoicing: '',
    invoicingSystem: '',
    consent: false,
  });

  const handleSubmit = () => {
    if (!formData.consent) {
      toast.error('יש לאשר העברת פרטים');
      return;
    }
    toast.success('הבקשה נשלחה בהצלחה!');
    setTimeout(() => navigate('/admin-services'), 1500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <TherapistSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-right">בקשה לדיווח שנתי ומס</h1>
          <p className="text-muted-foreground mb-8 text-right">
            עזרה בדיווח שנתי למס הכנסה וניהול ספרים
          </p>

          <div className="mb-6">
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <Card className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">פרטי עסק</h2>

                <div className="space-y-3">
                  <Label className="text-right block">סוג העסק</Label>
                  <RadioGroup value={formData.businessType} onValueChange={(value) => setFormData({ ...formData, businessType: value })}>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="patur" className="cursor-pointer">עוסק פטור</Label>
                      <RadioGroupItem value="patur" id="patur" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="murshe" className="cursor-pointer">עוסק מורשה</Label>
                      <RadioGroupItem value="murshe" id="murshe" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="company" className="cursor-pointer">חברה בע"מ</Label>
                      <RadioGroupItem value="company" id="company" />
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">שנות פעילות</Label>
                  <Select value={formData.yearsActive} onValueChange={(value) => setFormData({ ...formData, yearsActive: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחר/י" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">פחות משנה</SelectItem>
                      <SelectItem value="1-3">1-3 שנים</SelectItem>
                      <SelectItem value="3-5">3-5 שנים</SelectItem>
                      <SelectItem value="5+">מעל 5 שנים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-right block">האם יש לך כיום רואה חשבון / יועץ מס?</Label>
                  <RadioGroup value={formData.hasAccountant} onValueChange={(value) => setFormData({ ...formData, hasAccountant: value })}>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="no-acc" className="cursor-pointer">לא</Label>
                      <RadioGroupItem value="no" id="no-acc" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="yes-acc" className="cursor-pointer">כן</Label>
                      <RadioGroupItem value="yes" id="yes-acc" />
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">היקף פעילות</h2>

                <div className="space-y-2">
                  <Label className="text-right block">הערכה גסה של מחזור שנתי אחרון</Label>
                  <Select value={formData.annualRevenue} onValueChange={(value) => setFormData({ ...formData, annualRevenue: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחר/י טווח" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-100k">עד ₪100,000</SelectItem>
                      <SelectItem value="100k-250k">₪100,000-250,000</SelectItem>
                      <SelectItem value="250k-500k">₪250,000-500,000</SelectItem>
                      <SelectItem value="500k+">מעל ₪500,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-right block">האם יש לך מערכת לניהול חשבוניות?</Label>
                  <RadioGroup value={formData.hasInvoicing} onValueChange={(value) => setFormData({ ...formData, hasInvoicing: value })}>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="no-inv" className="cursor-pointer">לא</Label>
                      <RadioGroupItem value="no" id="no-inv" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="yes-inv" className="cursor-pointer">כן</Label>
                      <RadioGroupItem value="yes" id="yes-inv" />
                    </div>
                  </RadioGroup>
                </div>

                {formData.hasInvoicing === 'yes' && (
                  <div className="space-y-2">
                    <Label className="text-right block">איזו מערכת?</Label>
                    <Select value={formData.invoicingSystem} onValueChange={(value) => setFormData({ ...formData, invoicingSystem: value })}>
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="בחר/י" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greeninvoice">חשבונית ירוקה</SelectItem>
                        <SelectItem value="other">אחר</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.invoicingSystem === 'greeninvoice' && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-right text-green-900">
                      💡 ניתן יהיה לחבר ישירות לחשבונית ירוקה במסך האינטגרציות
                    </p>
                  </Card>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">אישור ושליחה</h2>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <h3 className="font-medium mb-2 text-right">מה צריך ממני</h3>
                  <ul className="text-sm space-y-1 text-right list-disc list-inside text-blue-900">
                    <li>דוחות חשבונית ירוקה (אם רלוונטי)</li>
                    <li>הוצאות מוכרות לצורך מס</li>
                    <li>פירוט הכנסות אחרות (אם קיימות)</li>
                    <li>מסמכים מבנקים/פנסיה</li>
                  </ul>
                </Card>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  />
                  <Label htmlFor="consent" className="text-sm cursor-pointer text-right">
                    אני מאשר/ת להעביר את הפרטים שלי לרואה חשבון/יועץ מס מורשה
                  </Label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {step < totalSteps && <Button onClick={() => setStep(step + 1)} size="lg">הבא <ChevronLeft className="w-4 h-4 mr-2" /></Button>}
                {step === totalSteps && <Button onClick={handleSubmit} size="lg"><Check className="w-4 h-4 ml-2" />שליחת בקשה</Button>}
              </div>
              {step > 1 && <Button onClick={() => setStep(step - 1)} variant="outline" size="lg"><ChevronRight className="w-4 h-4 ml-2" />חזרה</Button>}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
