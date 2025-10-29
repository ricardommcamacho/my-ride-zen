-- ==========================================
-- FASE 1: DATABASE SCHEMA & SECURITY
-- ==========================================

-- 1. ENUMs e Tipos Personalizados
CREATE TYPE vehicle_type AS ENUM ('car', 'motorcycle', 'electric');
CREATE TYPE fuel_type AS ENUM ('gasoline', 'diesel', 'electric', 'hybrid', 'lpg');
CREATE TYPE document_type AS ENUM ('insurance', 'registration', 'inspection', 'invoice', 'warranty', 'other');
CREATE TYPE maintenance_type AS ENUM ('oil_change', 'tire_rotation', 'brake_service', 'inspection', 'repair', 'battery_replacement', 'other');

-- 2. Tabela profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger para auto-criar profile ao signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 3. Tabela vehicles
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
  plate TEXT NOT NULL,
  type vehicle_type NOT NULL DEFAULT 'car',
  fuel_type fuel_type NOT NULL DEFAULT 'gasoline',
  current_km INTEGER DEFAULT 0 CHECK (current_km >= 0),
  tank_capacity DECIMAL(5,2),
  battery_capacity DECIMAL(6,2),
  is_primary BOOLEAN DEFAULT false,
  avatar_url TEXT,
  purchase_date DATE,
  vin TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_plate_per_user UNIQUE (user_id, plate)
);

CREATE INDEX idx_vehicles_user_id ON public.vehicles(user_id);
CREATE INDEX idx_vehicles_primary ON public.vehicles(user_id, is_primary);

-- Trigger para garantir apenas 1 veículo primário por user
CREATE OR REPLACE FUNCTION public.ensure_single_primary_vehicle()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE public.vehicles
    SET is_primary = false
    WHERE user_id = NEW.user_id AND id != NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_vehicle_primary_update
  BEFORE INSERT OR UPDATE ON public.vehicles
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION public.ensure_single_primary_vehicle();

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies para vehicles
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own vehicles"
  ON public.vehicles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vehicles"
  ON public.vehicles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vehicles"
  ON public.vehicles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own vehicles"
  ON public.vehicles FOR DELETE
  USING (auth.uid() = user_id);

-- 4. Tabela documents
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type document_type NOT NULL DEFAULT 'other',
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  expiry_date DATE,
  reminder_days_before INTEGER DEFAULT 30,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_vehicle_id ON public.documents(vehicle_id);
CREATE INDEX idx_documents_expiry ON public.documents(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies para documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view documents of own vehicles"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = documents.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert documents for own vehicles"
  ON public.documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = documents.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update documents of own vehicles"
  ON public.documents FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = documents.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete documents of own vehicles"
  ON public.documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = documents.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- 5. Tabela maintenance_logs
CREATE TABLE public.maintenance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  type maintenance_type NOT NULL,
  description TEXT NOT NULL,
  cost DECIMAL(10,2) DEFAULT 0 CHECK (cost >= 0),
  odometer INTEGER NOT NULL CHECK (odometer >= 0),
  service_date DATE NOT NULL DEFAULT CURRENT_DATE,
  next_service_date DATE,
  next_service_km INTEGER,
  receipt_url TEXT,
  service_provider TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_maintenance_vehicle_id ON public.maintenance_logs(vehicle_id);
CREATE INDEX idx_maintenance_service_date ON public.maintenance_logs(service_date DESC);
CREATE INDEX idx_maintenance_next_service ON public.maintenance_logs(next_service_date) WHERE next_service_date IS NOT NULL;

CREATE TRIGGER update_maintenance_logs_updated_at
  BEFORE UPDATE ON public.maintenance_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies para maintenance_logs
ALTER TABLE public.maintenance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view maintenance of own vehicles"
  ON public.maintenance_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_logs.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert maintenance for own vehicles"
  ON public.maintenance_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_logs.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update maintenance of own vehicles"
  ON public.maintenance_logs FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_logs.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete maintenance of own vehicles"
  ON public.maintenance_logs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = maintenance_logs.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- 6. Tabela fuel_records
CREATE TABLE public.fuel_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL,
  quantity DECIMAL(8,3) NOT NULL CHECK (quantity > 0),
  cost DECIMAL(10,2) NOT NULL CHECK (cost >= 0),
  price_per_unit DECIMAL(6,3) NOT NULL CHECK (price_per_unit >= 0),
  odometer INTEGER NOT NULL CHECK (odometer >= 0),
  fuel_date DATE NOT NULL DEFAULT CURRENT_DATE,
  station_name TEXT,
  location TEXT,
  is_full_tank BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fuel_vehicle_id ON public.fuel_records(vehicle_id);
CREATE INDEX idx_fuel_date ON public.fuel_records(fuel_date DESC);
CREATE INDEX idx_fuel_odometer ON public.fuel_records(vehicle_id, odometer DESC);

-- RLS Policies para fuel_records
ALTER TABLE public.fuel_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view fuel records of own vehicles"
  ON public.fuel_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = fuel_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert fuel records for own vehicles"
  ON public.fuel_records FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = fuel_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update fuel records of own vehicles"
  ON public.fuel_records FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = fuel_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete fuel records of own vehicles"
  ON public.fuel_records FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicles
      WHERE vehicles.id = fuel_records.vehicle_id
      AND vehicles.user_id = auth.uid()
    )
  );

-- 7. Storage Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-documents', 'vehicle-documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('vehicle-photos', 'vehicle-photos', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies para vehicle-documents
CREATE POLICY "Users can upload documents for own vehicles"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view documents of own vehicles"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vehicle-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete documents of own vehicles"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicle-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- RLS Policies para vehicle-photos
CREATE POLICY "Users can upload photos for own vehicles"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view photos of own vehicles"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vehicle-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete photos of own vehicles"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'vehicle-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );