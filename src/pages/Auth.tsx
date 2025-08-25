import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Code, GraduationCap } from 'lucide-react';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập đầy đủ email và mật khẩu',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: 'Đăng nhập thất bại',
            description: 'Email hoặc mật khẩu không chính xác',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Lỗi đăng nhập',
            description: error.message,
            variant: 'destructive',
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: 'Đăng nhập thành công',
          description: 'Chào mừng bạn đến với Codetrio!',
        });
        // Force page reload for clean state
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: 'Lỗi đăng nhập',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !fullName) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Lỗi',
        description: 'Mật khẩu phải có ít nhất 6 ký tự',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          toast({
            title: 'Tài khoản đã tồn tại',
            description: 'Email này đã được đăng ký, vui lòng đăng nhập',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Lỗi đăng ký',
            description: error.message,
            variant: 'destructive',
          });
        }
        return;
      }

      if (data.user) {
        toast({
          title: 'Đăng ký thành công',
          description: 'Tài khoản đã được tạo, bạn có thể đăng nhập ngay!',
        });
        
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: 'Lỗi đăng ký',
        description: 'Đã có lỗi xảy ra, vui lòng thử lại',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <Code className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Codetrio</h1>
          </div>
          <p className="text-muted-foreground flex items-center justify-center gap-1">
            <GraduationCap className="h-4 w-4" />
            Hệ thống quản lý lớp học lập trình
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Chào mừng đến với Codetrio</CardTitle>
            <CardDescription>
              Đăng nhập hoặc đăng ký để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Đăng nhập</TabsTrigger>
                <TabsTrigger value="signup">Đăng ký</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="admin@codetrio.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Mật khẩu</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Họ và tên</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mật khẩu</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Mật khẩu phải có ít nhất 6 ký tự
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Tài khoản demo:</strong><br />
                Email: ntq.145@gmail.com<br />
                Mật khẩu: 123456
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}