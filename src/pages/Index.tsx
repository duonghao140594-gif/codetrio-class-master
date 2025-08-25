import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { RankBadge } from '@/components/RankBadge';
import { 
  Code, 
  GraduationCap, 
  Trophy, 
  Users, 
  Plus,
  Settings,
  LogOut
} from 'lucide-react';

interface Class {
  id: string;
  name: string;
  description: string;
  language: string;
  student_count: number;
}

const Index = () => {
  const { user, signOut, hasRole, userRole } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          student_count:students(count)
        `);

      if (error) {
        console.error('Error fetching classes:', error);
        return;
      }

      const classesWithCount = data.map(cls => ({
        ...cls,
        student_count: cls.student_count?.[0]?.count || 0
      }));

      setClasses(classesWithCount);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg">
                <Code className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">Codetrio</h1>
                <p className="text-sm text-muted-foreground">Hệ thống quản lý lớp học lập trình</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user?.email}</p>
                <Badge variant={hasRole('admin') ? 'default' : 'secondary'} className="text-xs">
                  {hasRole('admin') ? 'Quản trị viên' : 'Học viên'}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                {hasRole('admin') && (
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Quản lý
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Danh sách lớp học</h2>
              <p className="text-muted-foreground">
                Khám phá các lớp học lập trình C++ và Python
              </p>
            </div>
            
            {hasRole('admin') && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm lớp học
              </Button>
            )}
          </div>

          {classes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Chưa có lớp học nào</h3>
                <p className="text-muted-foreground mb-4">
                  {hasRole('admin') 
                    ? 'Bắt đầu bằng cách tạo lớp học đầu tiên của bạn'
                    : 'Vui lòng liên hệ với quản trị viên để được thêm vào lớp học'
                  }
                </p>
                {hasRole('admin') && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo lớp học đầu tiên
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {classes.map((cls) => (
                <Card key={cls.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{cls.name}</CardTitle>
                      <Badge variant="outline">
                        {cls.language}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {cls.description || 'Không có mô tả'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{cls.student_count} học sinh</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Trophy className="h-4 w-4 mr-2" />
                        Xếp hạng
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Demo ranking section */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Hệ thống xếp hạng Codetrio
              </CardTitle>
              <CardDescription>
                Hệ thống cấp bậc dựa trên điểm số giúp tạo động lực học tập
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4 border rounded-lg">
                  <RankBadge tier="silver" points={950} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Dưới 1100 điểm
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <RankBadge tier="gold" points={1200} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    1100-1299 điểm
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <RankBadge tier="diamond" points={1400} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    1300-1499 điểm
                  </p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <RankBadge tier="master" points={1650} size="lg" />
                  <p className="text-sm text-muted-foreground mt-2">
                    1500+ điểm
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
