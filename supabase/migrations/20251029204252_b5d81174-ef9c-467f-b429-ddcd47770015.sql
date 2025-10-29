-- Add INSERT policy for profiles table to allow new user registration
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);