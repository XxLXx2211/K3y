-- Create the api_keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    service TEXT NOT NULL,
    key TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    expiration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on created_at for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON public.api_keys(created_at DESC);

-- Create an index on category for filtering
CREATE INDEX IF NOT EXISTS idx_api_keys_category ON public.api_keys(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for authenticated users
-- Note: For a production app, you might want more restrictive policies
CREATE POLICY "Enable all operations for authenticated users" ON public.api_keys
    FOR ALL USING (auth.role() = 'authenticated');

-- Create a policy for anonymous users (if you want to allow anonymous access)
-- Uncomment the following lines if you want to allow anonymous access
-- CREATE POLICY "Enable all operations for anonymous users" ON public.api_keys
--     FOR ALL USING (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER trigger_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
