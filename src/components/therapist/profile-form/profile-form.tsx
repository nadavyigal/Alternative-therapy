import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { TherapistProfile } from "@/lib/therapist-profile";
import { issue, modality } from "@/lib/schema";

type ProfileFormProps = {
  action: (formData: FormData) => Promise<void>;
  profile: TherapistProfile | null;
  modalities: Array<typeof modality.$inferSelect>;
  issues: Array<typeof issue.$inferSelect>;
  selectedModalityIds: Set<string>;
  selectedIssueIds: Set<string>;
  statusMessage?: ReactNode;
};

export function ProfileForm({
  action,
  profile,
  modalities,
  issues,
  selectedModalityIds,
  selectedIssueIds,
  statusMessage,
}: ProfileFormProps) {
  return (
    <form action={action} className="space-y-6">
      {statusMessage}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">פרטי פרופיל</CardTitle>
          <CardDescription>
            מידע בסיסי שיופיע בדף הציבורי שלך.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              שם תצוגה
            </label>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={profile?.displayName ?? ""}
              placeholder="שם המטפל/ת"
              required
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="slug" className="text-sm font-medium">
              כתובת הפרופיל
            </label>
            <Input
              id="slug"
              name="slug"
              defaultValue={profile?.slug ?? ""}
              placeholder="פרופיל-טיפול"
            />
            <p className="text-xs text-muted-foreground">
              זו תהיה הכתובת הציבורית שלך: /t/הפרופיל-שלך
            </p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="bio" className="text-sm font-medium">
              תיאור קצר
            </label>
            <Textarea
              id="bio"
              name="bio"
              rows={5}
              defaultValue={profile?.bio ?? ""}
              placeholder="ספר/י על הגישה הטיפולית שלך."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">זמינות ומיקום</CardTitle>
          <CardDescription>
            איך אפשר לפגוש אותך וכמה זה עולה.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="city" className="text-sm font-medium">
              עיר
            </label>
            <Input
              id="city"
              name="city"
              defaultValue={profile?.city ?? ""}
              placeholder="תל אביב"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isOnline"
              defaultChecked={profile?.isOnline ?? false}
              className="h-4 w-4 accent-teal-600"
            />
            <span className="text-sm font-medium">אפשרות לטיפול אונליין</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <label htmlFor="priceMin" className="text-sm font-medium">
                מחיר מינימלי
              </label>
              <Input
                id="priceMin"
                name="priceMin"
                type="number"
                min={0}
                defaultValue={profile?.priceMin ?? ""}
                placeholder="200"
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="priceMax" className="text-sm font-medium">
                מחיר מקסימלי
              </label>
              <Input
                id="priceMax"
                name="priceMax"
                type="number"
                min={0}
                defaultValue={profile?.priceMax ?? ""}
                placeholder="350"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">פרטי קשר</CardTitle>
          <CardDescription>דרכי יצירת קשר שיופיעו בדף.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="whatsappPhone" className="text-sm font-medium">
              וואטסאפ
            </label>
            <Input
              id="whatsappPhone"
              name="whatsappPhone"
              defaultValue={profile?.whatsappPhone ?? ""}
              placeholder="+972-52-123-4567"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="contactEmail" className="text-sm font-medium">
              אימייל לפרסום
            </label>
            <Input
              id="contactEmail"
              name="contactEmail"
              type="email"
              defaultValue={profile?.contactEmail ?? ""}
              placeholder="clinic@דוגמה.co.il"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="languages" className="text-sm font-medium">
              שפות טיפול
            </label>
            <Input
              id="languages"
              name="languages"
              defaultValue={profile?.languages?.join(", ") ?? ""}
              placeholder="עברית, אנגלית"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">תחומי טיפול</CardTitle>
          <CardDescription>בחר/י את ההתמחויות הרלוונטיות.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-3">
            <h3 className="text-sm font-semibold">שיטות טיפול</h3>
            {modalities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                עדיין לא הוזנו שיטות טיפול.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {modalities.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      name="modalityIds"
                      value={item.id}
                      defaultChecked={selectedModalityIds.has(item.id)}
                      className="h-4 w-4 accent-teal-600"
                    />
                    <span className="text-sm">{item.nameHe}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <h3 className="text-sm font-semibold">בעיות נפוצות</h3>
            {issues.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                עדיין לא הוזנו בעיות טיפול.
              </p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {issues.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border px-3 py-2"
                  >
                    <input
                      type="checkbox"
                      name="issueIds"
                      value={item.id}
                      defaultChecked={selectedIssueIds.has(item.id)}
                      className="h-4 w-4 accent-teal-600"
                    />
                    <span className="text-sm">{item.nameHe}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">פרסום הפרופיל</CardTitle>
          <CardDescription>הפעל/י כדי שהפרופיל יהיה גלוי.</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="published"
              defaultChecked={profile?.published ?? false}
              className="h-4 w-4 accent-teal-600"
            />
            <span className="text-sm font-medium">פרסום פעיל</span>
          </label>
        </CardContent>
        <CardFooter className="justify-start">
          <Button type="submit">שמירת שינויים</Button>
        </CardFooter>
      </Card>
    </form>
  );
}
