'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthActions } from '../utils';

type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const { login, storeToken } = AuthActions();

  const onSubmit = (data: FormData) => {
    setLoading(true)
    login(data.email, data.password)
      .then((res) => {
        console.log(res.data)
        storeToken(res.data.access, "access");
        storeToken(res.data.refresh, "refresh");
        router.push("/dashboard");
      })
      .catch((err) => {
        console.log(err)
        setError("root", { type: "manual", message: err.json?.detail });
      }).finally(()=> setLoading(false));
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <CardTitle className="text-2xl font-bold">CCIAG</CardTitle>
          <p className="text-sm text-muted-foreground">
            Merci d'entrer votre email et mot de passe.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10"
                  {...register("email", { required: true })}
                />
                {errors.email && (
                  <span className="text-xs text-red-600">Email is required</span>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  {...register("password", { required: true })}
                />
                {errors.password && (
                  <span className="text-xs text-red-600">Password is required</span>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
            {errors.root && (
              <span className="text-xs text-red-600">{errors.root.message}</span>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}