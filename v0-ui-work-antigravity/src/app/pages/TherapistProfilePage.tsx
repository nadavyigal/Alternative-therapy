import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Checkbox } from '../components/ui/checkbox';
import { mockTherapists } from '../data/mockData';
import { MapPin, Video, CheckCircle2, Award, Languages, DollarSign, ChevronRight, Send } from 'lucide-react';
import { toast } from 'sonner';

export function TherapistProfilePage() {
  const { id } = useParams();
  const therapist = mockTherapists.find(t => t.id === id);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    preferredContact: 'phone',
    agreedToTerms: false,
  });

  if (!therapist) {
    return <div>Therapist not found</div>;
  }

  const handleSubmit = () => {
    if (!contactForm.agreedToTerms) {
      toast.error('יש לאשר את תנאי השימוש');
      return;
    }
    toast.success('הפנייה נשלחה בהצלחה! המטפל/ת יצור/תצור קשר בקרוב');
    setContactForm({
      name: '',
      email: '',
      phone: '',
      message: '',
      preferredContact: 'phone',
      agreedToTerms: false,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/directory" className="flex items-center gap-2 text-sm hover:text-primary">
              <ChevronRight className="w-4 h-4" />
              חזרה לתוצאות
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <Card className="p-8 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex-shrink-0"></div>
            <div className="flex-1 text-right">
              <div className="flex flex-wrap gap-2 mb-2 justify-end">
                {therapist.verified && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle2 className="w-4 h-4 ml-1" />
                    מסמך מאומת
                  </Badge>
                )}
                {therapist.licensed && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Award className="w-4 h-4 ml-1" />
                    פסיכולוג/ית מוסמך/ת
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold mb-2">{therapist.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{therapist.title}</p>
              <div className="flex gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <Send className="w-4 h-4 ml-2" />
                      שליחת פנייה
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-right">יצירת קשר עם {therapist.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">שם מלא</Label>
                        <Input
                          id="contact-name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">מייל</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">טלפון</Label>
                        <Input
                          id="contact-phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="text-right"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-message">מה חשוב לך לספר?</Label>
                        <Textarea
                          id="contact-message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="text-right"
                          rows={4}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>אמצעי יצירת קשר מועדף</Label>
                        <RadioGroup value={contactForm.preferredContact} onValueChange={(value) => setContactForm({ ...contactForm, preferredContact: value })}>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="phone-contact" className="cursor-pointer">טלפון</Label>
                            <RadioGroupItem value="phone" id="phone-contact" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="email-contact" className="cursor-pointer">מייל</Label>
                            <RadioGroupItem value="email" id="email-contact" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="whatsapp-contact" className="cursor-pointer">וואטסאפ</Label>
                            <RadioGroupItem value="whatsapp" id="whatsapp-contact" />
                          </div>
                        </RadioGroup>
                      </div>
                      <div className="flex items-start gap-2">
                        <Checkbox
                          id="contact-terms"
                          checked={contactForm.agreedToTerms}
                          onCheckedChange={(checked) => setContactForm({ ...contactForm, agreedToTerms: checked as boolean })}
                        />
                        <Label htmlFor="contact-terms" className="text-sm cursor-pointer">
                          אני מאשר/ת את תנאי השימוש והפרטיות
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSubmit} className="flex-1">שליחת פנייה</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="lg">שיתוף פרופיל</Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-right">על המטפל/ת</h2>
              <p className="text-muted-foreground leading-relaxed text-right">{therapist.bio}</p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-right">שיטות טיפול</h2>
              <div className="flex flex-wrap gap-2 justify-end">
                {therapist.modalities.map((modality) => (
                  <Badge key={modality} variant="secondary">{modality}</Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-right">בעיות שמטפל/ת בהן</h2>
              <div className="flex flex-wrap gap-2 justify-end">
                {therapist.issues.map((issue) => (
                  <Badge key={issue} variant="outline">{issue}</Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-right">מיקום וזמינות</h3>
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span>{therapist.location}</span>
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                {therapist.remote && (
                  <div className="flex items-center gap-2 justify-end">
                    <span>טיפולים מרחוק זמינים</span>
                    <Video className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 text-right">שפות</h3>
              <div className="flex items-center gap-2 justify-end">
                <div className="flex flex-wrap gap-1">
                  {therapist.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">{lang}</Badge>
                  ))}
                </div>
                <Languages className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </Card>

            {therapist.priceRange && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-right">טווח מחירים</h3>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-muted-foreground">{therapist.priceRange}</span>
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <Card className="p-6 mt-8 bg-muted/30">
          <p className="text-sm text-muted-foreground text-right">
            <strong className="text-foreground">הצהרת אחריות:</strong> טיפולים אלטרנטיביים אינם מחליפים טיפול רפואי או פסיכיאטרי.
            במקרה של מצב רפואי או נפשי חמור, יש לפנות לשירותי בריאות מוסמכים או לשירותי חירום.
          </p>
        </Card>
      </div>
    </div>
  );
}
