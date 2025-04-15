
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { initializeTestUsers } from '@/integrations/supabase/auth-admin';
import { toast } from 'sonner';

export const CreateTestUsers: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleCreateUsers = async () => {
    setIsCreating(true);
    setResult(null);
    
    try {
      await initializeTestUsers();
      setResult({ 
        success: true, 
        message: 'Test users created successfully! You can now login with admin@example.com / admin123 or accountant@example.com / accountant123' 
      });
      toast.success('Test users created successfully!');
    } catch (error: any) {
      setResult({ 
        success: false, 
        message: `Failed to create test users: ${error.message}` 
      });
      toast.error(`Failed to create test users: ${error.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Test Users</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will create test users in the database with the following credentials:
        </p>
        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Admin:</div>
            <div>admin@example.com / admin123</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">Accountant:</div>
            <div>accountant@example.com / accountant123</div>
          </div>
        </div>
        
        {result && (
          <Alert className={`mt-4 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateUsers} 
          disabled={isCreating}
          className="w-full"
        >
          {isCreating ? 'Creating Users...' : 'Create Test Users'}
        </Button>
      </CardFooter>
    </Card>
  );
};
