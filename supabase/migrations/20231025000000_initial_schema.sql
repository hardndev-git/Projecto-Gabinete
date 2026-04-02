/*
# Schema Inicial do Sistema de Gestão Documental

## Query Description:
Esta migração cria as tabelas base para o Sistema de Gestão Documental, incluindo organizações, perfis de usuário, tipos de documento e registros de entrada/saída. Também configura as políticas de Row Level Security (RLS) para garantir que os usuários acessem apenas os dados do seu próprio Gabinete/Organismo.

## Metadata:
- Schema-Category: Structural
- Impact-Level: High
- Requires-Backup: false
- Reversible: true

## Structure Details:
- public.organismos: Armazena os gabinetes/organismos.
- public.profiles: Perfil do usuário vinculado à autenticação e ao organismo.
- public.tipos_documento: Tabela de domínio para tipos de documentos.
- public.documentos_entrada: Registros de entrada.
- public.documentos_saida: Registros de saída (vinculados a uma entrada).

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Requer usuários autenticados para operações.
*/

CREATE TABLE public.organismos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nome_completo TEXT NOT NULL,
    organismo_id UUID REFERENCES public.organismos(id),
    role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.tipos_documento (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.documentos_entrada (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo_doc_id UUID REFERENCES public.tipos_documento(id),
    data_entrada DATE NOT NULL,
    data_emissao DATE NOT NULL,
    assunto TEXT NOT NULL,
    origem TEXT NOT NULL,
    num_ref TEXT NOT NULL,
    upload_url TEXT,
    organismo_id UUID REFERENCES public.organismos(id),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.documentos_saida (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    documento_entrada_id UUID REFERENCES public.documentos_entrada(id),
    data_saida DATE NOT NULL,
    assunto TEXT NOT NULL,
    destino TEXT NOT NULL,
    num_ref TEXT NOT NULL,
    estado TEXT CHECK (estado IN ('Despachado', 'Pronunciamento', 'Parecer', 'Encaminhado')) NOT NULL,
    upload_url TEXT,
    organismo_id UUID REFERENCES public.organismos(id),
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.organismos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_documento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_entrada ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_saida ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança (RLS)
CREATE POLICY "Usuários veem seu próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins veem todos os perfis do seu organismo" ON public.profiles FOR SELECT USING (
    organismo_id = (SELECT organismo_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Leitura de tipos de documento pública para autenticados" ON public.tipos_documento FOR SELECT TO authenticated USING (true);
CREATE POLICY "Leitura de organismos pública para autenticados" ON public.organismos FOR SELECT TO authenticated USING (true);

CREATE POLICY "Usuários veem entradas do seu organismo" ON public.documentos_entrada FOR SELECT USING (
    organismo_id = (SELECT organismo_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Usuários inserem entradas no seu organismo" ON public.documentos_entrada FOR INSERT WITH CHECK (
    organismo_id = (SELECT organismo_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Usuários veem saídas do seu organismo" ON public.documentos_saida FOR SELECT USING (
    organismo_id = (SELECT organismo_id FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Usuários inserem saídas no seu organismo" ON public.documentos_saida FOR INSERT WITH CHECK (
    organismo_id = (SELECT organismo_id FROM public.profiles WHERE id = auth.uid())
);
