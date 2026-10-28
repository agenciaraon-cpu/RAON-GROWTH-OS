-- ==============================================================================
-- RAON System — Storage Buckets & Policies
-- Descrição: Configuração de buckets do Supabase Storage para Avatares e Logos
-- ==============================================================================

-- 1. Criar bucket para avatares dos usuários
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Criar bucket para logomarcas das empresas
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para 'avatars'
CREATE POLICY "Avatares são publicamente visíveis"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

CREATE POLICY "Usuários autenticados podem fazer upload de seu avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Usuários podem atualizar seu próprio avatar"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Usuários podem excluir seu próprio avatar"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'avatars' 
        AND auth.role() = 'authenticated'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Políticas para 'logos'
CREATE POLICY "Logomarcas são publicamente visíveis"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'logos');

CREATE POLICY "Membros autorizados podem enviar logomarca da empresa"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'logos'
        AND auth.role() = 'authenticated'
    );
