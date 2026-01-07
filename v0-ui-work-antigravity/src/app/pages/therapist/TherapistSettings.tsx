import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch'; // Assuming Switch component exists or using generic checkbox
import { Bell, Lock, Eye, Monitor } from 'lucide-react';

export function TherapistSettings() {
    return (
        <div className="flex min-h-screen">
            <TherapistSidebar />
            <main className="flex-1 p-8 pr-32">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-slate-800 mb-8 text-right">הגדרות</h1>

                    <div className="space-y-6">
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6 justify-end">
                                <h2 className="text-xl font-semibold">התראות</h2>
                                <Bell className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        {/* Toggle would go here */}
                                    </div>
                                    <span className="text-slate-700">קבלת התראות על פניות חדשות במייל</span>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        {/* Toggle would go here */}
                                    </div>
                                    <span className="text-slate-700">קבלת סיכום שבועי</span>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-6 justify-end">
                                <h2 className="text-xl font-semibold">פרטיות ואבטחה</h2>
                                <Lock className="w-5 h-5 text-primary" />
                            </div>
                            <div className="space-y-4 text-right">
                                <Button variant="outline" className="w-full justify-start">
                                    שינוי סיסמה
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                                    מחיקת חשבון
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
