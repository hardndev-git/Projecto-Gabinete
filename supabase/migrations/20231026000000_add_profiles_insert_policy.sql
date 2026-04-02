/*
# Adicionar políticas de inserção e atualização para profiles

## Query Description:
Esta migração adiciona políticas de segurança (RLS) na tabela `profiles` para permitir que Administradores possam cadastrar e atualizar perfis de novos usuários no sistema, algo que estava bloqueado no esquema inicial.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabela `profiles`: Adição de políticas de INSERT e UPDATE.

## Security Implications:
- RLS Status: Mantido como Enabled.
- Policy Changes: Sim (Novas políticas adicionadas).
- Auth Requirements: Apenas usuários autenticados com role 'admin' ou o próprio usuário podem inserir/atualizar.
*/

-- Permitir que admins insiram novos perfis
CREATE POLICY "Admins podem inserir perfis" ON public.profiles
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);

-- Permitir que o próprio usuário insira seu perfil (necessário para o fluxo de cadastro via client)
CREATE POLICY "Usuários podem inserir seu próprio perfil" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Permitir que admins atualizem perfis
CREATE POLICY "Admins podem atualizar perfis" ON public.profiles
FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
    )
);
