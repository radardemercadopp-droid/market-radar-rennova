// Script SQL para executar no console Supabase
// Copie e cole no SQL Editor do Supabase

const setupSQL = `
CREATE TABLE IF NOT EXISTS radar_inteligencias (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('preco', 'tech', 'lancamento', 'evento', 'campanha', 'posicionamento', 'outro')),
  competidor TEXT,
  descricao TEXT NOT NULL,
  data_observacao DATE,
  fonte TEXT,
  dados_preco JSONB,
  dados_tech JSONB,
  dados_outros JSONB,
  arquivos_json TEXT
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_radar_tipo ON radar_inteligencias(tipo);
CREATE INDEX IF NOT EXISTS idx_radar_competidor ON radar_inteligencias(competidor);
CREATE INDEX IF NOT EXISTS idx_radar_data ON radar_inteligencias(created_at DESC);

-- Habilitar RLS (Row Level Security) se quiser (opcional)
-- ALTER TABLE radar_inteligencias ENABLE ROW LEVEL SECURITY;

-- Permitir leitura/escrita pública (se não quiser autenticação)
CREATE POLICY "allow_all_radar" ON radar_inteligencias FOR ALL USING (true) WITH CHECK (true);
`;

console.log('SQL para executar no Supabase SQL Editor:');
console.log(setupSQL);
