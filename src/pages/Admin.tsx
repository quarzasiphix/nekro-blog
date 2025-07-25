import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BlogsList } from '@/components/BlogsList';
import { BlogEditor } from '@/components/BlogEditor';
import { CategoriesList } from '@/components/CategoriesList';
import { useToast } from '@/hooks/use-toast';
import { LogOut, Plus } from 'lucide-react';

const Admin = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('blogs');
  const [editingBlog, setEditingBlog] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    navigate('/');
  };

  const handleNewBlog = () => {
    setEditingBlog('new');
    setActiveTab('editor');
  };

  const handleEditBlog = (blogId: string) => {
    setEditingBlog(blogId);
    setActiveTab('editor');
  };

  const handleSaveBlog = () => {
    setEditingBlog(null);
    setActiveTab('blogs');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog CRM</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="editor">Editor</TabsTrigger>
            </TabsList>
            {activeTab === 'blogs' && (
              <Button onClick={handleNewBlog}>
                <Plus className="w-4 h-4 mr-2" />
                New Blog
              </Button>
            )}
          </div>

          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <BlogsList onEdit={handleEditBlog} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage blog categories</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoriesList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor">
            <Card>
              <CardHeader>
                <CardTitle>{editingBlog === 'new' ? 'Create New Blog' : 'Edit Blog'}</CardTitle>
                <CardDescription>Write and edit your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <BlogEditor blogId={editingBlog} onSave={handleSaveBlog} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;