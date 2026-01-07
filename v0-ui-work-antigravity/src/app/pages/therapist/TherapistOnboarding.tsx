import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ChevronLeft, ChevronRight, Upload, Check, Shield } from 'lucide-react';
import { modalities, issues, populations, languages } from '../../data/mockData';
import { toast } from 'sonner';

export function TherapistOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [formData, setFormData] = useState({
    // Step 1
    firstName: '',
    lastName: '',
    title: '',
    experience: '',
    profileImage: null as File | null,
    // Step 2
    selectedModalities: [] as string[],
    selectedIssues: [] as string[],
    selectedPopulations: [] as string[],
    // Step 3
    hasClinic: false,
    city: '',
    offersRemote: false,
    selectedLanguages: [] as string[],
    priceRange: '',
    // Step 4
    documents: [] as { name: string; type: string; issuer: string; date: string }[],
  });

  const progress = (step / totalSteps) * 100;

  const toggleArrayItem = (array: string[], item: string) => {
    if (array.includes(item)) {
      return array.filter((i) => i !== item);
    }
    return [...array, item];
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = () => {
    toast.success('הפרופיל שלך מוכן! המסמכים בבדיקה');
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const stepTitles = [
    'פרטים אישיים',
    'תחומי טיפול וקהל יעד',
    'מיקום ושפות',
    'מסמכים ואימות',
    'סיום והתחלה',
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl">טיפולנט</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">הקמת פרופיל מטפל</h1>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">
              שלב {step} מתוך {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between text-xs">
            {stepTitles.map((title, index) => (
              <span
                key={index}
                className={step > index + 1 ? 'text-primary font-medium' : step === index + 1 ? 'text-foreground font-medium' : 'text-muted-foreground'}
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Info */}
          <Card className="lg:col-span-1 p-6 h-fit bg-muted/50">
            <h3 className="font-semibold mb-3 text-right">💡 טיפים</h3>
            {step === 1 && (
              <div className="text-sm text-muted-foreground text-right space-y-2">
                <p>• שם המטפל יופיע כפי שתכתבו אותו</p>
                <p>• הכותרת המקצועית היא מה שהמטופלים יראו ראשון</p>
                <p>• תמונת פרופיל מקצועית מעלה אמון</p>
              </div>
            )}
            {step === 2 && (
              <div className="text-sm text-muted-foreground text-right space-y-2">
                <p>• בחרו את כל התחומים שאתם מטפלים בהם</p>
                <p>• ככל שתהיו ספציפיים יותר, כך תקבלו פניות מתאימות יותר</p>
              </div>
            )}
            {step === 3 && (
              <div className="text-sm text-muted-foreground text-right space-y-2">
                <p>• ציון שפות נוספות מגדיל את קהל המטופלים הפוטנציאליים</p>
                <p>• טיפולים מרחוק מאפשרים לכם גמישות מקסימלית</p>
              </div>
            )}
            {step === 4 && (
              <div className="text-sm text-muted-foreground text-right space-y-2">
                <p>• העלאת תעודות מסייעת לקבל את תג "מאומת"</p>
                <p>• התהליך לוקח 2-3 ימי עסקים</p>
                <p>• פורמטים נתמכים: PDF, JPG, PNG</p>
              </div>
            )}
            {step === 5 && (
              <div className="text-sm text-muted-foreground text-right space-y-2">
                <p>✓ הפרופיל שלכם מוכן</p>
                <p>✓ נוכל להתחיל לשלוח לכם פניות</p>
                <p>✓ תוכלו לבקש שירותים אדמיניסטרטיביים</p>
              </div>
            )}
          </Card>

          {/* Right Panel - Form */}
          <Card className="lg:col-span-2 p-6">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-right">פרטים אישיים</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">כותרת מקצועית</Label>
                    <Input
                      id="title"
                      placeholder="לדוגמה: פסיכולוג קליני ומטפל NLP"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">ניסיון מקצועי (שנים)</Label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
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
                    <Label>תמונת פרופיל</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">גררו תמונה או לחצו להעלאה</p>
                      <Button variant="outline" size="sm">בחר קובץ</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Modalities & Target Audience */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-right">תחומי טיפול וקהל יעד</h2>

                <div className="space-y-3">
                  <Label>תחומי טיפול (בחר/י לפחות אחד)</Label>
                  <div className="flex flex-wrap gap-2">
                    {modalities.map((modality) => (
                      <Badge
                        key={modality}
                        variant={formData.selectedModalities.includes(modality) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            selectedModalities: toggleArrayItem(formData.selectedModalities, modality),
                          })
                        }
                      >
                        {modality}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>נושאים/בעיות שמטפל/ת בהם</Label>
                  <div className="flex flex-wrap gap-2">
                    {issues.map((issue) => (
                      <Badge
                        key={issue}
                        variant={formData.selectedIssues.includes(issue) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            selectedIssues: toggleArrayItem(formData.selectedIssues, issue),
                          })
                        }
                      >
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>קהל יעד</Label>
                  <div className="flex flex-wrap gap-2">
                    {populations.map((population) => (
                      <Badge
                        key={population}
                        variant={formData.selectedPopulations.includes(population) ? 'default' : 'outline'}
                        className="cursor-pointer hover:bg-primary/90"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            selectedPopulations: toggleArrayItem(formData.selectedPopulations, population),
                          })
                        }
                      >
                        {population}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Location & Languages */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-right">מיקום ושפות</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Switch checked={formData.hasClinic} onCheckedChange={(checked) => setFormData({ ...formData, hasClinic: checked })} />
                    <div className="text-right">
                      <p className="font-medium">אני מקבל/ת מטופלים בקליניקה</p>
                      <p className="text-sm text-muted-foreground">יש לך מקום קבוע לטיפולים?</p>
                    </div>
                  </div>

                  {formData.hasClinic && (
                    <div className="space-y-4 pr-4 border-r-2 border-primary/20">
                      <div className="space-y-2">
                        <Label htmlFor="city">עיר</Label>
                        <Select value={formData.city} onValueChange={(value) => setFormData({ ...formData, city: value })}>
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="בחר/י עיר" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tlv">תל אביב-יפו</SelectItem>
                            <SelectItem value="jlm">ירושלים</SelectItem>
                            <SelectItem value="hfa">חיפה</SelectItem>
                            <SelectItem value="bs">באר שבע</SelectItem>
                            <SelectItem value="ptach">פתח תקווה</SelectItem>
                            <SelectItem value="ra">ראשון לציון</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <Switch checked={formData.offersRemote} onCheckedChange={(checked) => setFormData({ ...formData, offersRemote: checked })} />
                    <div className="text-right">
                      <p className="font-medium">אני מציע/ה טיפולים מרחוק</p>
                      <p className="text-sm text-muted-foreground">זום, טלפון או וידאו</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>שפות</Label>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((language) => (
                        <Badge
                          key={language}
                          variant={formData.selectedLanguages.includes(language) ? 'default' : 'outline'}
                          className="cursor-pointer hover:bg-primary/90"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              selectedLanguages: toggleArrayItem(formData.selectedLanguages, language),
                            })
                          }
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

            {/* Step 4: Documents */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-right">תעודות והכשרות</h2>

                <Card className="p-4 bg-blue-50 border-blue-200">
                  <p className="text-sm text-right text-blue-900">
                    <strong>אודות אימות מסמכים:</strong> הצוות שלנו יבדוק את המסמכים שהעלית ויציג סמל "מאומת" בפרופיל שלך. התהליך לוקח בדרך כלל 2-3 ימי עסקים.
                  </p>
                </Card>

                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="font-medium mb-2">גררו קבצי PDF/JPG או לחצו להעלאה</p>
                  <p className="text-sm text-muted-foreground mb-4">ניתן להעלות מספר קבצים</p>
                  <Button variant="outline">בחר קבצים</Button>
                </div>

                <div className="space-y-3">
                  <Label>דוגמאות לסוגי מסמכים:</Label>
                  <ul className="text-sm text-muted-foreground space-y-1 text-right list-disc list-inside">
                    <li>תעודת מטפל/ת מוסמך/ת</li>
                    <li>תואר אקדמי רלוונטי</li>
                    <li>רישיון מקצועי (אם רלוונטי)</li>
                    <li>תעודות השתלמות</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 5: Complete */}
            {step === 5 && (
              <div className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold">הפרופיל שלך כמעט מוכן!</h2>
                <div className="space-y-2 text-muted-foreground max-w-md mx-auto">
                  <p>אנחנו בודקים את המסמכים שהעלית.</p>
                  <p>בינתיים, הפרופיל יופיע כ"ממתין לאימות".</p>
                  <p>תוכל/י להתחיל לקבל פניות ממטופלים לאחר האימות.</p>
                </div>
                <div className="flex gap-4 justify-center pt-4">
                  <Button variant="outline" size="lg" onClick={() => navigate('/profile')}>
                    צפייה בפרופיל הציבורי
                  </Button>
                  <Button size="lg" onClick={handleFinish} className="bg-primary hover:bg-primary/90">
                    כניסה ללוח הבקרה
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 5 && (
              <div className="flex justify-between items-center mt-8 pt-6 border-t">
                <div className="flex gap-2">
                  {step < totalSteps - 1 && (
                    <Button onClick={handleNext} size="lg">
                      הבא
                      <ChevronLeft className="w-4 h-4 mr-2" />
                    </Button>
                  )}
                  {step === totalSteps - 1 && (
                    <Button onClick={() => setStep(5)} size="lg">
                      סיום
                      <Check className="w-4 h-4 mr-2" />
                    </Button>
                  )}
                </div>
                <div className="flex gap-2">
                  {step > 1 && (
                    <Button onClick={handleBack} variant="outline" size="lg">
                      <ChevronRight className="w-4 h-4 ml-2" />
                      חזרה
                    </Button>
                  )}
                  <Button variant="ghost" size="lg">
                    שמירה ויציאה
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
