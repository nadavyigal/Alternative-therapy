import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { modalities, issues, populations, languages } from '../data/mockData';
import { ChevronRight, ChevronLeft, Check, Upload } from 'lucide-react';
import { toast } from 'sonner';

export function TherapistSignup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    phone: '',
    email: '',
    selectedModalities: [] as string[],
    selectedIssues: [] as string[],
    selectedPopulations: [] as string[],
    hasClinic: false,
    city: '',
    offersRemote: false,
    selectedLanguages: [] as string[],
    priceRange: '',
    agreedToTerms: false,
  });
  const navigate = useNavigate();

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    if (!formData.agreedToTerms) {
      toast.error('יש לאשר את תנאי השימוש');
      return;
    }
    toast.success('הפרופיל נשמר בהצלחה! המסמכים שלך בבדיקה.');
    setTimeout(() => navigate('/therapist/dashboard'), 1500);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter(i => i !== item);
    }
    return [...array, item];
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ChevronRight className="w-4 h-4" />
            חזרה לדף הבית
          </Link>
          <h1 className="text-3xl font-bold mb-2">הצטרפות מטפלים</h1>
          <p className="text-muted-foreground">מלא/י את הפרטים ליצירת פרופיל מקצועי</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-muted-foreground">שלב {step} מתוך {totalSteps}</span>
            <span className="font-medium">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span className={step >= 1 ? 'text-primary font-medium' : ''}>פרטים אישיים</span>
            <span className={step >= 2 ? 'text-primary font-medium' : ''}>תחומי טיפול</span>
            <span className={step >= 3 ? 'text-primary font-medium' : ''}>מיקום ושפות</span>
            <span className={step >= 4 ? 'text-primary font-medium' : ''}>סיום</span>
          </div>
        </div>

        <Card className="p-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-right">פרטים אישיים</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">שם פרטי</Label>
                  <Input 
                    id="firstName" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">שם משפחה</Label>
                  <Input 
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">כותרת מקצועית</Label>
                  <Input 
                    id="title" 
                    placeholder="לדוגמה: מטפלת ברייקי, פסיכולוג קליני"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון נייד</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-right"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">אימייל</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Modalities & Issues */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-right">תחומי טיפול וקהל יעד</h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>שיטות טיפול (בחר/י לפחות אחת)</Label>
                  <div className="flex flex-wrap gap-2">
                    {modalities.map((modality) => (
                      <Badge
                        key={modality}
                        variant={formData.selectedModalities.includes(modality) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFormData({
                          ...formData,
                          selectedModalities: toggleArrayItem(formData.selectedModalities, modality)
                        })}
                      >
                        {modality}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>בעיות שמטפל/ת בהן</Label>
                  <div className="flex flex-wrap gap-2">
                    {issues.map((issue) => (
                      <Badge
                        key={issue}
                        variant={formData.selectedIssues.includes(issue) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFormData({
                          ...formData,
                          selectedIssues: toggleArrayItem(formData.selectedIssues, issue)
                        })}
                      >
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>אוכלוסיות יעד</Label>
                  <div className="flex flex-wrap gap-2">
                    {populations.map((population) => (
                      <Badge
                        key={population}
                        variant={formData.selectedPopulations.includes(population) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFormData({
                          ...formData,
                          selectedPopulations: toggleArrayItem(formData.selectedPopulations, population)
                        })}
                      >
                        {population}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Languages */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-right">מיקום ושפות</h2>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="text-right">
                    <p className="font-medium">אני מקבל/ת מטופלים בקליניקה</p>
                    <p className="text-sm text-muted-foreground">יש לך מקום קבוע לטיפולים?</p>
                  </div>
                  <Switch 
                    checked={formData.hasClinic}
                    onCheckedChange={(checked) => setFormData({ ...formData, hasClinic: checked })}
                  />
                </div>
                {formData.hasClinic && (
                  <div className="space-y-2">
                    <Label htmlFor="city">עיר</Label>
                    <Input 
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="text-right"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="text-right">
                    <p className="font-medium">אני מציע/ה טיפולים מרחוק</p>
                    <p className="text-sm text-muted-foreground">זום, טלפון או וידאו</p>
                  </div>
                  <Switch 
                    checked={formData.offersRemote}
                    onCheckedChange={(checked) => setFormData({ ...formData, offersRemote: checked })}
                  />
                </div>
                <div className="space-y-3">
                  <Label>שפות</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <Badge
                        key={language}
                        variant={formData.selectedLanguages.includes(language) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setFormData({
                          ...formData,
                          selectedLanguages: toggleArrayItem(formData.selectedLanguages, language)
                        })}
                      >
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceRange">טווח מחירים (אופציונלי)</Label>
                  <Input 
                    id="priceRange" 
                    placeholder="לדוגמה: ₪250-400"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    className="text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Documents & Publish */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-right">מסמכים ופרסום</h2>
              <div className="space-y-6">
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">העלה תעודות ומסמכים</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    גרור קבצים או לחץ להעלאה (PDF, JPG, PNG)
                  </p>
                  <Button variant="outline">בחר קבצים</Button>
                </div>
                <Card className="p-4 bg-muted/50">
                  <p className="text-sm text-right">
                    <strong>אודות אימות מסמכים:</strong> הצוות שלנו יבדוק את המסמכים שהעלית ויציג סמל "מאומת" בפרופיל שלך.
                    התהליך לוקח בדרך כלל 2-3 ימי עסקים.
                  </p>
                </Card>
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={formData.agreedToTerms}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreedToTerms: checked as boolean })}
                  />
                  <Label htmlFor="terms" className="text-sm cursor-pointer">
                    אני מאשר/ת את תנאי השימוש והצהרת האחריות. אני מבין/ה שטיפולים אלטרנטיביים אינם מחליפים טיפול רפואי או פסיכיאטרי.
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {step < totalSteps && (
                <Button onClick={handleNext} size="lg">
                  הבא
                  <ChevronLeft className="w-4 h-4 mr-2" />
                </Button>
              )}
              {step === totalSteps && (
                <Button onClick={handleSubmit} size="lg" className="bg-primary hover:bg-primary/90">
                  <Check className="w-4 h-4 ml-2" />
                  פרסום פרופיל
                </Button>
              )}
            </div>
            {step > 1 && (
              <Button onClick={handleBack} variant="outline" size="lg">
                <ChevronRight className="w-4 h-4 ml-2" />
                חזרה
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
