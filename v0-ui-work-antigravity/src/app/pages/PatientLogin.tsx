import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Heart, ArrowRight } from 'lucide-react';

export function PatientLogin() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-400/20 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-teal-400/20 blur-3xl" />
            </div>

            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800">כניסת מטופלים</h1>
                    <p className="text-slate-600">התחברו כדי לנהל את התורים והטיפולים שלכם</p>
                </div>

                <Card className="p-8 backdrop-blur-xl bg-white/70 border-white/50">
                    <form className="space-y-6">
                        <div className="space-y-2 text-right">
                            <Label htmlFor="email">אימייל או נייד</Label>
                            <Input id="email" type="text" placeholder="name@example.com" className="bg-white/50" />
                        </div>
                        <div className="space-y-2 text-right">
                            <Label htmlFor="password">סיסמה</Label>
                            <Input id="password" type="password" className="bg-white/50" />
                        </div>

                        <Button className="w-full h-12 text-lg bg-pink-500 hover:bg-pink-600 shadow-pink-200">
                            כניסה
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        חדשים כאן?{' '}
                        <Link to="#" className="text-pink-600 font-semibold hover:underline">
                            הרשמה למטופלים
                        </Link>
                    </div>
                </Card>

                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                        חזרה לדף הבית
                    </Link>
                </div>
            </div>
        </div>
    );
}
