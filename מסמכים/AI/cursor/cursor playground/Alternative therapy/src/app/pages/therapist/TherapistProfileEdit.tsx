import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Upload, X, Save, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { modalities, issues, populations, languages } from '../../data/mockData';

export function TherapistProfileEdit() {
  const navigate = useNavigate();
  
  // Pre-populate with existing data (in a real app, fetch from API)
  const [formData, setFormData] = useState({
    firstName: 'רחל',
    lastName: 'כהן',
    title: 'ד"ר',
    specialty: 'פסיכולוגית קלינית מומחית',
    email: 'rachel.cohen@example.com',
    phone: '054-1234567',
    city: 'תל אביב',
    address: '',
    bio: 'פסיכולוגית קלינית בעלת ותק של 10 שנים. מתמחה בטיפול בחרדה, דיכאון ומשברי חיים. מאמינה בגישה אינטגרטיבית המשלבת כלים קוגניטיביים-התנהגותיים (CBT) עם גישה דינמית.',
    experience: '10',
    selectedModalities: ['CBT', 'טיפול דינמי'],
    selectedIssues: ['חרדה', 'דיכאון'],
    selectedPopulations: ['מבוגרים'],
    selectedLanguages: ['עברית', 'אנגלית'],
    priceRange: '300-400',
    offersRemote: true,
    profileImage: null as File | null,
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: string, item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, profileImage: e.target.files![0] }));
      toast.success('תמונה הועלתה בהצלחה');
    }
  };

  const handleSave = () => {
    // In a real app, save to API
    toast.success('הפרופיל עודכן בהצלחה!');
    setTimeout(() => navigate('/profile'), 1000);
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="flex min-h-screen">
      <TherapistSidebar />
      <main className="flex-1 p-8 pr-32">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCancel}>
                ביטול
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 ml-2" />
                שמירה
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 text-right">עריכת פרופיל</h1>
          </div>

          <div className="grid gap-6">
            {/* Personal Details */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-right">פרטים אישיים</h2>
              
              {/* Profile Image */}
              <div className="flex justify-end mb-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
                    {formData.title}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button type="button" variant="outline" size="sm" asChild>
                      <span>
                        <Upload className="w-3 h-3 ml-2" />
                        העלאת תמונה
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4" dir="rtl">
                <div className="space-y-2">
                  <Label htmlFor="firstName">שם פרטי</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">שם משפחה</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">תואר</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder='לדוגמה: "ד"ר", "גב׳"'
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">התמחות</Label>
                  <Input
                    id="specialty"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">שנות ניסיון</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Contact Details */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-right">פרטי קשר</h2>
              <div className="grid md:grid-cols-2 gap-4" dir="rtl">
                <div className="space-y-2">
                  <Label htmlFor="email">דוא"ל</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">טלפון</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">עיר</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">כתובת קליניקה (אופציונלי)</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Bio */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-right">אודות</h2>
              <div className="space-y-2" dir="rtl">
                <Label htmlFor="bio">תיאור מקצועי</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={6}
                  placeholder="ספר/י על הניסיון המקצועי שלך, הגישה הטיפולית, והתמחויות..."
                />
                <p className="text-sm text-muted-foreground text-right">
                  {formData.bio.length} תווים
                </p>
              </div>
            </Card>

            {/* Treatment Modalities */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-right">שיטות טיפול</h2>
              <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                {modalities.map((modality) => (
                  <Badge
                    key={modality.id}
                    variant={formData.selectedModalities.includes(modality.name) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleArrayItem('selectedModalities', modality.name)}
                  >
                    {formData.selectedModalities.includes(modality.name) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                    {modality.name}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Issues & Populations */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8">
                <h2 className="text-xl font-semibold mb-6 text-right">תחומי טיפול</h2>
                <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                  {issues.slice(0, 10).map((issue) => (
                    <Badge
                      key={issue.id}
                      variant={formData.selectedIssues.includes(issue.name) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('selectedIssues', issue.name)}
                    >
                      {formData.selectedIssues.includes(issue.name) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                      {issue.name}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-xl font-semibold mb-6 text-right">אוכלוסיות יעד</h2>
                <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
                  {populations.map((population) => (
                    <Badge
                      key={population.id}
                      variant={formData.selectedPopulations.includes(population.name) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem('selectedPopulations', population.name)}
                    >
                      {formData.selectedPopulations.includes(population.name) && (
                        <X className="w-3 h-3 ml-1" />
                      )}
                      {population.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>

            {/* Languages & Pricing */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6 text-right">שפות ותמחור</h2>
              <div className="grid md:grid-cols-2 gap-6" dir="rtl">
                <div className="space-y-3">
                  <Label>שפות</Label>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {languages.map((language) => (
                      <Badge
                        key={language.id}
                        variant={formData.selectedLanguages.includes(language.name) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleArrayItem('selectedLanguages', language.name)}
                      >
                        {formData.selectedLanguages.includes(language.name) && (
                          <X className="w-3 h-3 ml-1" />
                        )}
                        {language.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="priceRange">טווח מחירים לפגישה (₪)</Label>
                  <Input
                    id="priceRange"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value)}
                    placeholder="לדוגמה: 300-400"
                  />
                  <p className="text-sm text-muted-foreground">טווח מחירים משוער לפגישה</p>
                </div>
              </div>
            </Card>

            {/* Save Actions */}
            <div className="flex justify-end gap-3 pb-8">
              <Button variant="outline" onClick={handleCancel} size="lg">
                ביטול
              </Button>
              <Button onClick={handleSave} size="lg">
                <Save className="w-4 h-4 ml-2" />
                שמירת שינויים
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
