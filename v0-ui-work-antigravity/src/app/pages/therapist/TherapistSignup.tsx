import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Shield } from 'lucide-react';
import { toast } from 'sonner';

export function TherapistSignup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    agreedToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.phone || !formData.password) {
      toast.error('נא למלא את כל השדות');
      return;
    }
    
    if (!formData.agreedToTerms) {
      toast.error('יש לאשר את תנאי השימוש');
      return;
    }

    toast.success('חשבון נוצר בהצלחה!');
    setTimeout(() => navigate('/onboarding'), 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl">טיפולנט</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">פתיחת חשבון מטפל/ת</h1>
          <p className="text-muted-foreground">
            הצטרפו לפלטפורמה והתחילו לקבל מטופלים חדשים
          </p>
        </div>

        {/* Signup Form */}
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="text-right"
                placeholder="email@example.com"
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
                placeholder="050-1234567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="text-right"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreedToTerms: checked as boolean })
                }
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                אני מאשר/ת את{' '}
                <a href="#" className="text-primary hover:underline">
                  תנאי השימוש
                </a>{' '}
                ו
                <a href="#" className="text-primary hover:underline">
                  מדיניות הפרטיות
                </a>
              </Label>
            </div>

            <Button type="submit" className="w-full" size="lg">
              המשך
            </Button>
          </form>
        </Card>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          כבר רשומים?{' '}
          <Link to="/dashboard" className="text-primary hover:underline font-medium">
            התחברות
          </Link>
        </p>
      </div>
    </div>
  );
}
