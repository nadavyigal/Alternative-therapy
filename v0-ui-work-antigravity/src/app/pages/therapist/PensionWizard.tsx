import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export function PensionWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [formData, setFormData] = useState({
    employmentStatus: '',
    yearsActive: '',
    hasExisting: '',
    existingProvider: '',
    goals: [] as string[],
    monthlyAmount: '',
    notes: '',
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
          <h1 className="text-3xl font-bold mb-2 text-right">בקשה לפנסיה וקרן השתלמות</h1>
          <p className="text-muted-foreground mb-8 text-right">
            התאמת פנסיה וקרנות השתלמות לעצמאיים
          </p>

          <div className="mb-6">
            <Progress value={(step / totalSteps) * 100} className="h-2" />
          </div>

          <Card className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">מצב תעסוקתי</h2>

                <div className="space-y-3">
                  <Label className="text-right block">מה המעמד שלך?</Label>
                  <RadioGroup value={formData.employmentStatus} onValueChange={(value) => setFormData({ ...formData, employmentStatus: value })}>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="self" className="cursor-pointer">עצמאי בלבד</Label>
                      <RadioGroupItem value="self" id="self" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="employee" className="cursor-pointer">שכיר/ה בלבד</Label>
                      <RadioGroupItem value="employee" id="employee" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="both" className="cursor-pointer">גם וגם</Label>
                      <RadioGroupItem value="both" id="both" />
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">כמה שנים את/ה עוסק/ת כמטפל/ת?</Label>
                  <Select value={formData.yearsActive} onValueChange={(value) => setFormData({ ...formData, yearsActive: value })}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="בחר/י" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-2">0-2 שנים</SelectItem>
                      <SelectItem value="3-5">3-5 שנים</SelectItem>
                      <SelectItem value="6-10">6-10 שנים</SelectItem>
                      <SelectItem value="10+">מעל 10 שנים</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">האם קיימת כבר הפרשה לפנסיה?</Label>
                  <RadioGroup value={formData.hasExisting} onValueChange={(value) => setFormData({ ...formData, hasExisting: value })}>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="no" className="cursor-pointer">לא</Label>
                      <RadioGroupItem value="no" id="no" />
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <Label htmlFor="yes" className="cursor-pointer">כן</Label>
                      <RadioGroupItem value="yes" id="yes" />
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">מטרות וחיסכון</h2>

                <div className="space-y-3">
                  <Label className="text-right block">מה תרצה/י לעשות?</Label>
                  {['עדכון/שיפור של הפנסיה הקיימת', 'פתיחת קרן השתלמות', 'בדיקת כיסוי ביטוחי נלווה'].map((goal) => (
                    <div key={goal} className="flex items-center gap-2 justify-end">
                      <Label htmlFor={goal} className="cursor-pointer">{goal}</Label>
                      <Checkbox
                        id={goal}
                        checked={formData.goals.includes(goal)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({ ...formData, goals: [...formData.goals, goal] });
                          } else {
                            setFormData({ ...formData, goals: formData.goals.filter(g => g !== goal) });
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">העדפות/שיקולים מיוחדים</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="text-right"
                    rows={4}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-right">אישור ושליחה</h2>
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent"
                    checked={formData.consent}
                    onCheckedChange={(checked) => setFormData({ ...formData, consent: checked as boolean })}
                  />
                  <Label htmlFor="consent" className="text-sm cursor-pointer text-right">
                    אני מאשר/ת להעביר את הפרטים שלי לגורם פנסיוני מורשה
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
