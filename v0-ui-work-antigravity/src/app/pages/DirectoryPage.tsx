import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockTherapists } from '../data/mockData';
import { Search, MapPin, Video, CheckCircle2, Award } from 'lucide-react';

export function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="font-semibold text-lg">טיפולנט</Link>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">חזרה לדף הבית</Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6 text-right">מצא את המטפל/ת המתאימ/ה</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="חפש לפי שם, בעיה או שיטת טיפול..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-12 text-right"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="מיקום" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tlv">תל אביב</SelectItem>
                <SelectItem value="jlm">ירושלים</SelectItem>
                <SelectItem value="hfa">חיפה</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="תחום טיפול" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reiki">רייקי</SelectItem>
                <SelectItem value="nlp">NLP</SelectItem>
                <SelectItem value="acupuncture">דיקור סיני</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="שפה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="he">עברית</SelectItem>
                <SelectItem value="en">אנגלית</SelectItem>
                <SelectItem value="ru">רוסית</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="מיון" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">ברירת מחדל</SelectItem>
                <SelectItem value="verified">מאומתים ראשונים</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTherapists.map((therapist) => (
            <Card key={therapist.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex-shrink-0"></div>
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <div className="flex gap-1">
                        {therapist.verified && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs">
                            <CheckCircle2 className="w-3 h-3 ml-1" />
                            מאומת
                          </Badge>
                        )}
                        {therapist.licensed && (
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            <Award className="w-3 h-3 ml-1" />
                            מוסמך
                          </Badge>
                        )}
                      </div>
                    </div>
                    <h3 className="font-semibold">{therapist.name}</h3>
                    <p className="text-sm text-muted-foreground">{therapist.title}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {therapist.modalities.slice(0, 3).map((modality) => (
                      <Badge key={modality} variant="outline" className="text-xs">
                        {modality}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground justify-end">
                    {therapist.remote && (
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        טיפולים מרחוק
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {therapist.location}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link to={`/therapist/${therapist.id}`}>צפייה בפרופיל</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
