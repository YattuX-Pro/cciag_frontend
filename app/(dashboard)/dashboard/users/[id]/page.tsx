'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit2,
  Key,
  Activity,
} from 'lucide-react';

export default function UserProfilePage() {
  const [user] = useState({
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-03-20',
    lastLogin: '2024-03-25 14:30',
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-cyan-500/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>
                  <User className="w-16 h-16" />
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-cyan-500">{user.name}</h2>
              <Badge
                variant="outline"
                className={user.status === 'active' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' : ''}
              >
                {user.status}
              </Badge>
              <Button
                variant="outline"
                className="mt-4 w-full border-cyan-500/20 hover:bg-cyan-500/10"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-cyan-500/20">
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center space-x-4 p-3 rounded-lg bg-cyan-500/5">
                <Mail className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-cyan-500/5">
                <Shield className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-cyan-500/5">
                <Calendar className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">{user.createdAt}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 rounded-lg bg-cyan-500/5">
                <Activity className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium">{user.lastLogin}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" className="border-cyan-500/20">
                <Key className="w-4 h-4 mr-2" />
                Reset Password
              </Button>
              <Button variant="destructive">
                Deactivate Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}