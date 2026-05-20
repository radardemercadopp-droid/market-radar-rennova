import { useState } from 'react';

export default function Home() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [competidor, setCompetidor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [fonte, setFonte] = useState('');
  const [confianca, setConfianca] = useState('');
  const [implicacao, setImplicacao] = useState('');
  const [impacto, setImpacto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Preço
  const [competidorPreco, setCompetidorPreco] = useState('');
  const [nomeDistribuidor, setNomeDistribuidor] = useState('');
  const [precoDistribuidor, setPrecoDistribuidor] = useState('');
  const [nomeMarca, setNomeMarca] = useState('');
  const [precoMarca, setPrecoMarca] = useState('');

  // Tech
  const [competidorTech, setCompetidorTech] = useState('');
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  const [precoEquipamento, setPrecoEquipamento] = useState('');
  const [mecanicaPagamento, setMecanicaPagamento] = useState('');
  const [especificacoesTech, setEspecificacoesTech] = useState('');
  const [suporteTech, setSuporteTech] = useState('');

  // Checkboxes
  const [checkDistribuidor, setCheckDistribuidor] = useState(false);
  const [checkMarca, setCheckMarca] = useState(false);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxI_APo8-WgKtNUGndMK-LNJBX0wg8HaF7Bhs759-cHKB_58g46LHaTU-wS2Dx8lyGqow/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagem('');

    let precoData = null;
    let techData = null;
    let competidorFinal = competidor;

    if (tipo === 'preco') {
      competidorFinal = competidorPreco;
      precoData = {};
      if (checkDistribuidor) {
        precoData.distribuidor = {
          nome: nomeDistribuidor,
          valor: precoDistribuidor
        };
      }
      if (checkMarca) {
        precoData.marca = {
          nome: nomeMarca,
          valor: precoMarca
        };
      }
    } else if (tipo === 'tech') {
      competidorFinal = competidorTech;
      techData = {
        nomeEquipamento,
        precoEquipamento,
        mecanicaPagamento,
        especificacoesTech,
        suporteTech
      };
    }

    const novaInteligencia = {
      dataCriacao: new Date().toLocaleString('pt-BR'),
      nome,
      tipo,
      competidor: competidorFinal,
      descricao,
      data,
      fonte,
      confianca,
      implicacao,
      impacto,
      preco: precoData,
      tech: techData
    };

    try {
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(novaInteligencia),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.status === 'sucesso') {
        setMensagem('✓ Inteligência enviada com sucesso!');
        // Limpar form
        setNome('');
        setTipo('');
        setCompetidor('');
        setDescricao('');
        setData('');
        setFonte('');
        setConfianca('');
        setImplicacao('');
        setImpacto('');
        setCompetidorPreco('');
        setNomeDistribuidor('');
        setPrecoDistribuidor('');
        setNomeMarca('');
        setPrecoMarca('');
        setCheckDistribuidor(false);
        setCheckMarca(false);
        setCompetidorTech('');
        setNomeEquipamento('');
        setPrecoEquipamento('');
        setMecanicaPagamento('');
        setEspecificacoesTech('');
        setSuporteTech('');
      } else {
        setMensagem('✗ Erro ao enviar: ' + (result.mensagem || 'Tente novamente'));
      }
    } catch (err) {
      setMensagem('✗ Erro: ' + err.message);
    }

    setEnviando(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <div style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #e0e0e0' }}>
        <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '500' }}>Market Radar - Rennova</h1>
        <p style={{ margin: '0.5rem 0 0', fontSize: '14px', color: '#666' }}>Reportar inteligências competitivas</p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        {/* Base */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Informações Básicas</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Seu nome *</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Tipo de inteligência *</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="">-- Selecionar --</option>
              <option value="lancamento">Lançamento de produto</option>
              <option value="preco">Preço</option>
              <option value="tech">Tech/Equipamento</option>
              <option value="evento">Evento/Participação</option>
              <option value="campanha">Campanha/Marketing</option>
              <option value="posicionamento">Posicionamento</option>
              <option value="outro">Outro</option>
            </select>
          </div>
        </div>

        {/* Preço */}
        {tipo === 'preco' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Detalhes - Preço</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Marca/Competidor</label>
              <select value={competidorPreco} onChange={(e) => setCompetidorPreco(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="">-- Selecionar --</option>
                <option value="Galderma">Galderma</option>
                <option value="Ilikia">Ilikia</option>
                <option value="Merz">Merz</option>
                <option value="AbbVie/Allergan">AbbVie/Allergan</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={checkDistribuidor} onChange={(e) => setCheckDistribuidor(e.target.checked)} />
                <span style={{ fontWeight: '500' }}>Distribuidor</span>
              </label>
              {checkDistribuidor && (
                <div style={{ marginLeft: '1.5rem' }}>
                  <input type="text" value={nomeDistribuidor} onChange={(e) => setNomeDistribuidor(e.target.value)} placeholder="Nome do distribuidor" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem', boxSizing: 'border-box' }} />
                  <input type="text" value={precoDistribuidor} onChange={(e) => setPrecoDistribuidor(e.target.value)} placeholder="Preço (ex: R$ 500)" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              )}
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#f9f9f9', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={checkMarca} onChange={(e) => setCheckMarca(e.target.checked)} />
                <span style={{ fontWeight: '500' }}>Marca Concorrente</span>
              </label>
              {checkMarca && (
                <div style={{ marginLeft: '1.5rem' }}>
                  <input type="text" value={nomeMarca} onChange={(e) => setNomeMarca(e.target.value)} placeholder="Nome da marca/produto" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', marginBottom: '0.5rem', boxSizing: 'border-box' }} />
                  <input type="text" value={precoMarca} onChange={(e) => setPrecoMarca(e.target.value)} placeholder="Preço (ex: R$ 450)" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tech */}
        {tipo === 'tech' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Detalhes - Tech/Equipamento</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Marca/Competidor</label>
              <select value={competidorTech} onChange={(e) => setCompetidorTech(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="">-- Selecionar --</option>
                <option value="Galderma">Galderma</option>
                <option value="Ilikia">Ilikia</option>
                <option value="Merz">Merz</option>
                <option value="AbbVie/Allergan">AbbVie/Allergan</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Nome do equipamento</label>
              <input type="text" value={nomeEquipamento} onChange={(e) => setNomeEquipamento(e.target.value)} placeholder="Ex: Rennova Tech Pro" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Preço da unidade</label>
              <input type="text" value={precoEquipamento} onChange={(e) => setPrecoEquipamento(e.target.value)} placeholder="Ex: R$ 50.000" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Mecânica de pagamento</label>
              <select value={mecanicaPagamento} onChange={(e) => setMecanicaPagamento(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="">-- Selecionar --</option>
                <option value="Compra direta">Compra direta (upfront)</option>
                <option value="Leasing">Leasing</option>
                <option value="Aluguel">Aluguel/Uso por demanda</option>
                <option value="SaaS">SaaS (assinatura)</option>
                <option value="Consórcio">Consórcio</option>
                <option value="Outro">Outro</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Especificações técnicas</label>
              <textarea value={especificacoesTech} onChange={(e) => setEspecificacoesTech(e.target.value)} placeholder="Potência, tecnologia, capacidade, etc." style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Suporte/Manutenção</label>
              <textarea value={suporteTech} onChange={(e) => setSuporteTech(e.target.value)} placeholder="Planos de suporte, garantia, treinamento" style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '60px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
            </div>
          </div>
        )}

        {/* Outros */}
        {tipo && tipo !== 'preco' && tipo !== 'tech' && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Detalhes</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Marca/Competidor</label>
              <select value={competidor} onChange={(e) => setCompetidor(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="">-- Selecionar --</option>
                <option value="Galderma">Galderma</option>
                <option value="Ilikia">Ilikia</option>
                <option value="Merz">Merz</option>
                <option value="AbbVie/Allergan">AbbVie/Allergan</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
          </div>
        )}

        {/* Descrição */}
        {tipo && (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Descrição e Contexto</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Descrição *</label>
                <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descreva com detalhes" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Data da observação *</label>
                <input type="date" value={data} onChange={(e) => setData(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Fonte *</label>
                <select value={fonte} onChange={(e) => setFonte(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="">-- Selecionar --</option>
                  <option value="Evento/Congresso">Evento/Congresso</option>
                  <option value="Site/Mídia digital">Site/Mídia digital</option>
                  <option value="Contato direto">Contato direto</option>
                  <option value="Mídia tradicional">Mídia tradicional</option>
                  <option value="Rede de vendas">Rede de vendas</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Confiança *</label>
                <select value={confianca} onChange={(e) => setConfianca(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="">-- Selecionar --</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Provável">Provável</option>
                  <option value="Rumor">Rumor</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '1rem' }}>Implicação para Rennova</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Por que importa? *</label>
                <textarea value={implicacao} onChange={(e) => setImplicacao(e.target.value)} placeholder="Descreva relevância e impacto" required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', minHeight: '80px', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '0.5rem' }}>Tipo de impacto *</label>
                <select value={impacto} onChange={(e) => setImpacto(e.target.value)} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}>
                  <option value="">-- Selecionar --</option>
                  <option value="Oportunidade">Oportunidade</option>
                  <option value="Ameaça">Ameaça</option>
                  <option value="Monitoramento">Monitoramento</option>
                  <option value="Informativo">Informativo</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid #e0e0e0', paddingTop: '1.5rem' }}>
              <button type="submit" disabled={enviando} style={{ flex: 1, padding: '0.75rem', background: enviando ? '#ccc' : '#333', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                {enviando ? 'Enviando...' : 'Enviar Inteligência'}
              </button>
              <button type="reset" style={{ flex: 1, padding: '0.75rem', background: '#f0f0f0', color: '#333', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>
                Limpar
              </button>
            </div>
          </>
        )}
      </form>

      {mensagem && (
        <div style={{ padding: '1rem', backgroundColor: mensagem.includes('✓') ? '#e8f5e9' : '#ffebee', color: mensagem.includes('✓') ? '#2e7d32' : '#c62828', borderRadius: '4px', textAlign: 'center', fontSize: '14px', border: `1px solid ${mensagem.includes('✓') ? '#c8e6c9' : '#ffcdd2'}` }}>
          {mensagem}
        </div>
      )}
    </div>
  );
}
