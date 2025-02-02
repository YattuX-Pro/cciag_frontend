'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { AuthActions } from '../utils';
import { roleBasedRoutes } from '@/types/const';
import { motion } from 'framer-motion';

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

  const { login, storeToken, getUserRoleFromToken, removeTokens } = AuthActions();

  useEffect(() => {
    removeTokens();
  }, []);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    login(data.email, data.password)
      .then(async (res) => {
        storeToken(res.data.access, "access");
        storeToken(res.data.refresh, "refresh");
        const role = getUserRoleFromToken(res.data.access);
        storeToken(role, "userRole");
        
        // Force token refresh and add small delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const allowedRoutes = roleBasedRoutes[role];
        router.push(allowedRoutes[0]);
      })
      .catch((err) => {
        setError("root", { type: "manual", message: err.json?.detail });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-950 via-cyan-900 to-cyan-950 animate-gradient-slow" />
      
      {/* Decorative background elements */}
      <div className="fixed inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-800/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-700/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 min-h-screen flex items-center justify-center p-4"
      >
        <Card className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border-cyan-900/20">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-16 h-16 mb-4"
            >
              <svg viewBox="0 0 24 24" fill="#22d3ee" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
              CCIAG
            </CardTitle>
            <p className="text-sm text-gray-400">
              Merci d'entrer votre email et mot de passe.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="pl-10 bg-gray-800/50 border-cyan-900/20 focus:border-cyan-500 focus:ring-cyan-500 placeholder-gray-400 text-gray-100"
                    {...register("email", { required: true })}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-400">Email is required</span>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-cyan-400" />
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-10 bg-gray-800/50 border-cyan-900/20 focus:border-cyan-500 focus:ring-cyan-500 placeholder-gray-400 text-gray-100"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <span className="text-xs text-red-400">Password is required</span>
                  )}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </motion.div>
              {errors.root && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-center my-2'
                >
                  <span className="text-xs text-red-400">Identifiant ou Mot de Passe invalide</span>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}