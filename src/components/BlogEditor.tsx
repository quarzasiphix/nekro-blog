import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

interface BlogEditorProps {
  blogId: string | null;
  onSave: () => void;
}

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  published: boolean;
  category_id: string | null;
  meta_description: string;
  meta_keywords: string;
  featured_image_url: string;
}

interface Category {
  id: string;
  name: string;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ blogId, onSave }) => {
  const [blog, setBlog] = useState<Partial<Blog>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: 'Dom Pogrzebowy Łódź',
    published: false,
    category_id: null,
    meta_description: '',
    meta_keywords: '',
    featured_image_url: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_categories')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchBlog = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setBlog(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (blogId && blogId !== 'new') {
      fetchBlog(blogId);
    }
  }, [blogId]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    if (!blog.title || !blog.content) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      const slug = blog.slug || generateSlug(blog.title!);
      const blogData = { 
        ...blog, 
        slug,
        title: blog.title!,
        content: blog.content!
      };

      if (blogId === 'new') {
        const { error } = await supabase
          .from('blogs')
          .insert(blogData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog created successfully",
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blogId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Blog updated successfully",
        });
      }

      onSave();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading blog...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={blog.title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            placeholder="Enter blog title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={blog.slug}
            onChange={(e) => setBlog({ ...blog, slug: e.target.value })}
            placeholder="blog-url-slug"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            value={blog.author}
            onChange={(e) => setBlog({ ...blog, author: e.target.value })}
            placeholder="Enter author name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={blog.category_id || ''}
            onValueChange={(value) => setBlog({ ...blog, category_id: value || null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="featured_image">Featured Image URL</Label>
          <Input
            id="featured_image"
            value={blog.featured_image_url}
            onChange={(e) => setBlog({ ...blog, featured_image_url: e.target.value })}
            placeholder="Enter image URL"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          value={blog.excerpt}
          onChange={(e) => setBlog({ ...blog, excerpt: e.target.value })}
          placeholder="Enter a brief excerpt"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={blog.content}
          onChange={(e) => setBlog({ ...blog, content: e.target.value })}
          placeholder="Write your blog content here..."
          rows={15}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="meta_description">Meta Description</Label>
          <Textarea
            id="meta_description"
            value={blog.meta_description}
            onChange={(e) => setBlog({ ...blog, meta_description: e.target.value })}
            placeholder="SEO meta description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="meta_keywords">Meta Keywords</Label>
          <Textarea
            id="meta_keywords"
            value={blog.meta_keywords}
            onChange={(e) => setBlog({ ...blog, meta_keywords: e.target.value })}
            placeholder="SEO keywords (comma separated)"
            rows={3}
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={blog.published}
          onCheckedChange={(checked) => setBlog({ ...blog, published: checked })}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : blogId === 'new' ? 'Create Blog' : 'Update Blog'}
        </Button>
      </div>
    </div>
  );
};