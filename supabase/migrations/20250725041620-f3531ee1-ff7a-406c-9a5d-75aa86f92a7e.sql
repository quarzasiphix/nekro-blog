-- Add RLS policies for authenticated users to manage blogs
CREATE POLICY "Authenticated users can create blogs" 
ON public.blogs 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update blogs" 
ON public.blogs 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete blogs" 
ON public.blogs 
FOR DELETE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view all blogs" 
ON public.blogs 
FOR SELECT 
TO authenticated
USING (true);

-- Add RLS policies for blog categories management
CREATE POLICY "Authenticated users can create categories" 
ON public.blog_categories 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories" 
ON public.blog_categories 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete categories" 
ON public.blog_categories 
FOR DELETE 
TO authenticated
USING (true);