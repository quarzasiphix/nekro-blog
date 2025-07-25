import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenTool, Users, Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Blog CRM System</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Manage your blog content with ease
          </p>
          <Link to="/auth">
            <Button size="lg">
              <Settings className="w-5 h-5 mr-2" />
              Access Admin Panel
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <PenTool className="w-8 h-8 mb-4 text-primary" />
              <CardTitle>Write & Edit</CardTitle>
              <CardDescription>
                Create and edit blog posts with our intuitive editor
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-8 h-8 mb-4 text-primary" />
              <CardTitle>Manage Categories</CardTitle>
              <CardDescription>
                Organize your content with custom categories
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="w-8 h-8 mb-4 text-primary" />
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>
                Full control over publishing and content management
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
