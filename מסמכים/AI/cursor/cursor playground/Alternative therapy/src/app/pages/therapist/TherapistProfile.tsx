import { Link } from 'react-router-dom';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export function TherapistProfile() {
    return (
        <div className="flex min-h-screen">
            <TherapistSidebar />
            <main className="flex-1 p-8 pr-32">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8 text-right">הפרופיל שלי</h1>

                    <div className="grid gap-6">
                        {/* Profile Header */}
                        <Card className="p-8">
                            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 text-right sm:text-right" dir="rtl">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border border-primary/20">
                                    ד"ר
                                </div>
                                <div className="flex-1 space-y-2">
                                    <h2 className="text-2xl font-bold text-slate-800">ד"ר רחל כהן</h2>
                                    <p className="text-lg text-muted-foreground">פסיכולוגית קלינית מומחית</p>
                                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            <span>rachel.cohen@example.com</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            <span>054-1234567</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            <span>תל אביב, ישראל</span>
                                        </div>
                                    </div>
                                </div>
                                <Button asChild>
                                    <Link to="/profile/edit">עריכת פרופיל</Link>
                                </Button>
                            </div>
                        </Card>

                        {/* Bio Section */}
                        <Card className="p-6">
                            <h3 className="text-xl font-semibold mb-4 text-right">אודות</h3>
                            <p className="text-slate-600 leading-relaxed text-right">
                                פסיכולוגית קלינית בעלת ותק של 10 שנים. מתמחה בטיפול בחרדה, דיכאון ומשברי חיים.
                                מאמינה בגישה אינטגרטיבית המשלבת כלים קוגניטיביים-התנהגותיים (CBT) עם גישה דינמית.
                            </p>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
