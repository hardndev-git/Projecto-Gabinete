/*
# Adicionar políticas de gerenciamento para Organismos e Tipos de Documento

## Query Description:
Esta migração adiciona políticas de segurança (RLS) que permitem aos administradores gerenciar (inserir, atualizar, deletar) os registros nas tabelas `organismos` e `tipos_documento`. Sem isso, apenas a leitura é permitida a todos, impedindo que o Admin cadastre novos organismos ou tipos de documento pela interface do sistema.

## Metadata:
- Schema-Category: "Security"
- Impact-Level: "Low"
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Tabela `organismos`: Nova política ALL para administradores.
- Tabela `tipos_documento`: Nova política ALL para administradores.

## Security Implications:
- RLS Status: Mantido habilitado.
- Policy Changes: Sim (novas políticas de escrita adicionadas).
- Auth Requirements: Requer usuário autenticado com role = 'admin' na tabela profiles.
*/

-- Políticas para a tabela organismos
CREATE POLICY "Admins gerenciam organismos" ON public.organismos
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Políticas para a tabela tipos_documento
CREATE POLICY "Admins gerenciam tipos de documento" ON public.tipos_documento
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
