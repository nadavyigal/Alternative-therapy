import { useState } from 'react';
import { TherapistSidebar } from '../../components/therapist/TherapistSidebar';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch'; // Assuming Switch component exists or using generic checkbox
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Bell, Lock, Eye, Monitor } from 'lucide-react';
import { toast } from 'sonner';

export function TherapistSettings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(true);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error('נא למלא את כל השדות');
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('הסיסמאות אינן תואמות');
            return;
        }
        // In a real app, send to API
        toast.success('הסיסמה שונתה בהצלחה');
        setShowPasswordDialog(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleDeleteAccount = () => {
        // In a real app, send deletion request to API
        toast.success('בקשת המחיקה נשלחה. נחזור אליך בהקדם');
        setShowDeleteDialog(false);
    };

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
                                    <Switch
                                        checked={emailNotifications}
                                        onCheckedChange={(checked) => {
                                            setEmailNotifications(checked);
                                            toast.success(checked ? 'התראות דוא"ל הופעלו' : 'התראות דוא"ל בוטלו');
                                        }}
                                    />
                                    <span className="text-slate-700">קבלת התראות על פניות חדשות במייל</span>
                                </div>
                                <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                                    <Switch
                                        checked={weeklyDigest}
                                        onCheckedChange={(checked) => {
                                            setWeeklyDigest(checked);
                                            toast.success(checked ? 'סיכום שבועי הופעל' : 'סיכום שבועי בוטל');
                                        }}
                                    />
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
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start"
                                    onClick={() => setShowPasswordDialog(true)}
                                >
                                    שינוי סיסמה
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    מחיקת חשבון
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-right">שינוי סיסמה</DialogTitle>
                        <DialogDescription className="text-right">
                            הזן את הסיסמה הנוכחית והסיסמה החדשה
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4" dir="rtl">
                        <div className="space-y-2">
                            <Label htmlFor="current">סיסמה נוכחית</Label>
                            <Input
                                id="current"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new">סיסמה חדשה</Label>
                            <Input
                                id="new"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm">אימות סיסמה חדשה</Label>
                            <Input
                                id="confirm"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            ביטול
                        </Button>
                        <Button onClick={handlePasswordChange}>
                            שמירה
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Account Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-right text-red-600">מחיקת חשבון</DialogTitle>
                        <DialogDescription className="text-right">
                            פעולה זו היא בלתי הפיכה. כל הנתונים שלך יימחקו לצמיתות.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="text-right space-y-2">
                        <p className="text-sm text-muted-foreground">
                            האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו תמחק:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>את כל פרטי הפרופיל שלך</li>
                            <li>את כל הפניות והמידע על מטופלים</li>
                            <li>את כל בקשות השירותים שלך</li>
                        </ul>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            ביטול
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            אישור מחיקה
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
