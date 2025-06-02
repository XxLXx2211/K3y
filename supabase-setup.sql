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

-- Create the passwords table
CREATE TABLE IF NOT EXISTS public.passwords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    service TEXT NOT NULL,
    password TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    expiration TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_api_keys_created_at ON public.api_keys(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_category ON public.api_keys(category);
CREATE INDEX IF NOT EXISTS idx_passwords_created_at ON public.passwords(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_passwords_category ON public.passwords(category);

-- Enable Row Level Security (RLS)
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.passwords ENABLE ROW LEVEL SECURITY;

-- Eliminar cualquier política existente
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.api_keys;
DROP POLICY IF EXISTS "Enable all operations for anonymous users" ON public.api_keys;
DROP POLICY IF EXISTS "Enable all operations for everyone" ON public.api_keys;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.passwords;
DROP POLICY IF EXISTS "Enable all operations for anonymous users" ON public.passwords;
DROP POLICY IF EXISTS "Enable all operations for everyone" ON public.passwords;

-- Crear políticas que permitan acceso anónimo
CREATE POLICY "Enable all operations for everyone" ON public.api_keys
    FOR ALL USING (true);

CREATE POLICY "Enable all operations for everyone" ON public.passwords
    FOR ALL USING (true);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_api_keys_updated_at ON public.api_keys;
CREATE TRIGGER trigger_api_keys_updated_at
    BEFORE UPDATE ON public.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_passwords_updated_at ON public.passwords;
CREATE TRIGGER trigger_passwords_updated_at
    BEFORE UPDATE ON public.passwords
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
