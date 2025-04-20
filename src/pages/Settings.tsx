
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Settings: React.FC = () => {
  return (
    <MainLayout>
      <div className="pb-4">
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground">
          Kelola pengaturan sistem akuntansi Anda
        </p>
      </div>

      <Tabs defaultValue="umum">
        <TabsList className="mb-4">
          <TabsTrigger value="umum">Umum</TabsTrigger>
          <TabsTrigger value="pajak">Pajak</TabsTrigger>
          <TabsTrigger value="sistem">Sistem</TabsTrigger>
        </TabsList>
        
        <TabsContent value="umum">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Umum</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Halaman ini sedang dalam pengembangan. Pengaturan umum akan tersedia segera.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pajak">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Pajak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Halaman ini sedang dalam pengembangan. Pengaturan pajak akan tersedia segera.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sistem">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-10 text-muted-foreground">
                Halaman ini sedang dalam pengembangan. Pengaturan sistem akan tersedia segera.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default Settings;
