import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Configuração Supabase
const SUPABASE_URL = 'https://rtvjkagmjomsfpgucwxk.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_5SjT35FPGgu_CCuseQQuhw_K1_xmCbJ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [fonte, setFonte] = useState('');
  const [arquivo, setArquivo] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');

  // Campo COMUM para todos os tipos - Distribuidor/Marca
  const [distribuidor, setDistribuidor] = useState('');
  const [precoDistribuidor, setPrecoDistribuidor] = useState('');
  const [marca, setMarca] = useState('');
  const [precoMarca, setPrecoMarca] = useState('');
  const [checkDistribuidor, setCheckDistribuidor] = useState(false);
  const [checkMarca, setCheckMarca] = useState(false);

  // Tech específico
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  const [precoEquipamento, setPrecoEquipamento] = useState('');
  const [mecanicaPagamento, setMecanicaPagamento] = useState('');
  const [especificacoesTech, setEspecificacoesTech] = useState('');
  const [suporteTech, setSuporteTech] = useState('');

  // Outros tipos
  const [produtoLancamento, setProdutoLancamento] = useState('');
  const [nomeEvento, setNomeEvento] = useState('');
  const [nomeCampanha, setNomeCampanha] = useState('');
  const [nomePosicionamento, setNomePosicionamento] = useState('');
  const [nomeOutro, setNomeOutro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setMensagem('');

    try {
      // Validações básicas
      if (!nome.trim()) {
        throw new Error('Por favor, preencha seu nome');
      }
      if (!tipo) {
        throw new Error('Por favor, selecione um tipo de inteligência');
      }
      if (!descricao.trim()) {
        throw new Error('Por favor, preencha a descrição');
      }
      if (!data) {
        throw new Error('Por favor, selecione a data da observação');
      }

      let tableName = '';
      let payload = {
        nome: nome.trim(),
        descricao: descricao.trim(),
        data_observacao: data,
        fonte: fonte || 'Não especificada',
        arquivos_json: JSON.stringify(arquivo)
      };

      // Adicionar distribuidor e marca quando preenchidos
      if (checkDistribuidor && distribuidor.trim()) {
        payload.distribuidor = distribuidor.trim();
      }
      if (checkMarca && marca.trim()) {
        payload.marca = marca.trim();
      }

      // Processamento específico por tipo
      switch (tipo) {
        case 'preco':
          if (!checkDistribuidor && !checkMarca) {
            throw new Error('Selecione pelo menos Distribuidor ou Marca');
          }
          tableName = 'radar_preco';
          if (checkDistribuidor && precoDistribuidor.trim()) {
            payload.preco_distribuidor = precoDistribuidor.trim();
          }
          if (checkMarca && precoMarca.trim()) {
            payload.preco_marca = precoMarca.trim();
          }
          break;

        case 'tech':
          if (!checkDistribuidor && !checkMarca) {
            throw new Error('Selecione pelo menos Distribuidor ou Marca');
          }
          tableName = 'radar_tech';
          payload.nome_equipamento = nomeEquipamento.trim() || null;
          payload.preco_equipamento = precoEquipamento.trim() || null;
          payload.mecanica_pagamento = mecanicaPagamento.trim() || null;
          payload.especificacoes = especificacoesTech.trim() || null;
          payload.suporte = suporteTech.trim() || null;
          break;

        case 'lancamento':
          tableName = 'radar_lancamento';
          payload.produto_lancado = produtoLancamento.trim() || null;
          break;

        case 'evento':
          tableName = 'radar_evento';
          payload.nome_evento = nomeEvento.trim() || null;
          break;

        case 'campanha':
          tableName = 'radar_campanha';
          payload.nome_campanha = nomeCampanha.trim() || null;
          break;

        case 'posicionamento':
          tableName = 'radar_posicionamento';
          payload.posicionamento = nomePosicionamento.trim() || null;
          break;

        case 'outro':
          tableName = 'radar_outro';
          payload.detalhes_outros = nomeOutro.trim() || null;
          break;

        default:
          throw new Error('Tipo de inteligência inválido');
      }

      // Inserir no Supabase na tabela correta
      const { data: insertData, error } = await supabase
        .from(tableName)
        .insert([payload]);

      if (error) {
        console.error('Erro Supabase:', error);
        throw new Error(error.message || 'Erro ao salvar inteligência');
      }

      setTipoMensagem('sucesso');
      setMensagem('✓ Inteligência salva com sucesso!');
      
      // Limpar formulário
      setTimeout(() => {
        setNome('');
        setTipo('');
        setDescricao('');
        setData('');
        setFonte('');
        setArquivo([]);
        setDistribuidor('');
        setPrecoDistribuidor('');
        setMarca('');
        setPrecoMarca('');
        setCheckDistribuidor(false);
        setCheckMarca(false);
        setNomeEquipamento('');
        setPrecoEquipamento('');
        setMecanicaPagamento('');
        setEspecificacoesTech('');
        setSuporteTech('');
        setProdutoLancamento('');
        setNomeEvento('');
        setNomeCampanha('');
        setNomePosicionamento('');
        setNomeOutro('');
        setMensagem('');
      }, 2000);

    } catch (err) {
      setTipoMensagem('erro');
      setMensagem(`✗ Erro: ${err.message}`);
    } finally {
      setEnviando(false);
    }
  };

  const handleArquivos = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setArquivo(prev => [...prev, {
          nome: file.name,
          dados: event.target.result
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px' }}>📊 Radar de Mercado</h1>
          <p style={{ margin: '0', fontSize: '14px', opacity: 0.9 }}>Rennova - Inteligência Competitiva</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
          
          {/* Mensagem de feedback */}
          {mensagem && (
            <div style={{
              padding: '15px',
              marginBottom: '20px',
              borderRadius: '8px',
              background: tipoMensagem === 'sucesso' ? '#d4edda' : '#f8d7da',
              color: tipoMensagem === 'sucesso' ? '#155724' : '#721c24',
              border: `1px solid ${tipoMensagem === 'sucesso' ? '#c3e6cb' : '#f5c6cb'}`,
              fontSize: '14px'
            }}>
              {mensagem}
            </div>
          )}

          {/* Campo: Seu nome */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Seu nome *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Campo: Tipo de inteligência */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Tipo de inteligência *
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">-- Selecione --</option>
              <option value="preco">Preço</option>
              <option value="tech">Tech/Equipamento</option>
              <option value="lancamento">Lançamento de produto</option>
              <option value="evento">Evento/Participação</option>
              <option value="campanha">Campanha/Marketing</option>
              <option value="posicionamento">Posicionamento</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* SEÇÃO COMUM: Distribuidor e Marca */}
          {['preco', 'tech', 'lancamento', 'evento', 'campanha', 'posicionamento', 'outro'].includes(tipo) && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Distribuidor / Marca Concorrente</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkDistribuidor}
                    onChange={(e) => setCheckDistribuidor(e.target.checked)}
                    style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <strong>Distribuidor</strong>
                </label>
                {checkDistribuidor && (
                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Nome do distribuidor"
                      value={distribuidor}
                      onChange={(e) => setDistribuidor(e.target.value)}
                      style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    {tipo === 'preco' && (
                      <input
                        type="text"
                        placeholder="Preço (ex: R$ 500)"
                        value={precoDistribuidor}
                        onChange={(e) => setPrecoDistribuidor(e.target.value)}
                        style={{
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={checkMarca}
                    onChange={(e) => setCheckMarca(e.target.checked)}
                    style={{ marginRight: '8px', width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <strong>Marca Concorrente</strong>
                </label>
                {checkMarca && (
                  <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Nome da marca"
                      value={marca}
                      onChange={(e) => setMarca(e.target.value)}
                      style={{
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                    {tipo === 'preco' && (
                      <input
                        type="text"
                        placeholder="Preço (ex: R$ 750)"
                        value={precoMarca}
                        onChange={(e) => setPrecoMarca(e.target.value)}
                        style={{
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SEÇÃO TECH */}
          {tipo === 'tech' && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Detalhes do Equipamento</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Nome do equipamento
                </label>
                <input
                  type="text"
                  value={nomeEquipamento}
                  onChange={(e) => setNomeEquipamento(e.target.value)}
                  placeholder="Ex: Laser XYZ, RF Device"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Preço da unidade
                  </label>
                  <input
                    type="text"
                    value={precoEquipamento}
                    onChange={(e) => setPrecoEquipamento(e.target.value)}
                    placeholder="Ex: USD 50.000"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Mecânica de pagamento
                  </label>
                  <input
                    type="text"
                    value={mecanicaPagamento}
                    onChange={(e) => setMecanicaPagamento(e.target.value)}
                    placeholder="Ex: À vista, parcelado"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Especificações técnicas
                </label>
                <textarea
                  value={especificacoesTech}
                  onChange={(e) => setEspecificacoesTech(e.target.value)}
                  placeholder="Frequência, potência, compatibilidades..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                  Suporte/Treinamento
                </label>
                <textarea
                  value={suporteTech}
                  onChange={(e) => setSuporteTech(e.target.value)}
                  placeholder="Tipo de suporte, garantia, treinamento oferecido..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>
          )}

          {/* SEÇÃO LANÇAMENTO */}
          {tipo === 'lancamento' && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Detalhes do Lançamento</h3>
              <input
                type="text"
                value={produtoLancamento}
                onChange={(e) => setProdutoLancamento(e.target.value)}
                placeholder="Nome do produto/solução lançada"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* SEÇÃO EVENTO */}
          {tipo === 'evento' && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Detalhes do Evento</h3>
              <input
                type="text"
                value={nomeEvento}
                onChange={(e) => setNomeEvento(e.target.value)}
                placeholder="Nome do evento/conferência"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* SEÇÃO CAMPANHA */}
          {tipo === 'campanha' && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Detalhes da Campanha</h3>
              <input
                type="text"
                value={nomeCampanha}
                onChange={(e) => setNomeCampanha(e.target.value)}
                placeholder="Nome/tema da campanha"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* SEÇÃO POSICIONAMENTO */}
          {tipo === 'posicionamento' && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Posicionamento</h3>
              <input
                type="text"
                value={nomePosicionamento}
                onChange={(e) => setNomePosicionamento(e.target.value)}
                placeholder="Descreva o novo posicionamento/estratégia"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* SEÇÃO OUTRO */}
          {tipo === 'outro' && (
            <div style={{
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ marginTop: 0, color: '#333' }}>Detalhes Adicionais</h3>
              <input
                type="text"
                value={nomeOutro}
                onChange={(e) => setNomeOutro(e.target.value)}
                placeholder="Descreva o tipo de inteligência"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Descrição */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Descrição *
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhe a inteligência coletada"
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box',
                minHeight: '100px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Data de observação */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Data da observação *
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Fonte */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Fonte
            </label>
            <select
              value={fonte}
              onChange={(e) => setFonte(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            >
              <option value="">-- Selecione --</option>
              <option value="evento">Evento/Conferência</option>
              <option value="imprensa">Imprensa/Mídia</option>
              <option value="vendas">Equipe de vendas</option>
              <option value="cliente">Feedback de cliente</option>
              <option value="website">Website/Redes sociais</option>
              <option value="outro">Outra</option>
            </select>
          </div>

          {/* Anexos */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
              Anexos (imagens)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleArquivos}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px',
                boxSizing: 'border-box'
              }}
            />
            {arquivo.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                {arquivo.length} arquivo(s) selecionado(s)
              </div>
            )}
          </div>

          {/* Botões */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '30px' }}>
            <button
              type="submit"
              disabled={enviando}
              style={{
                padding: '12px',
                background: enviando ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: enviando ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {enviando ? '⏳ Enviando...' : '✓ Enviar Inteligência'}
            </button>

            <button
              type="button"
              onClick={() => {
                setNome('');
                setTipo('');
                setDescricao('');
                setData('');
                setFonte('');
                setArquivo([]);
                setDistribuidor('');
                setPrecoDistribuidor('');
                setMarca('');
                setPrecoMarca('');
                setCheckDistribuidor(false);
                setCheckMarca(false);
                setNomeEquipamento('');
                setPrecoEquipamento('');
                setMecanicaPagamento('');
                setEspecificacoesTech('');
                setSuporteTech('');
                setProdutoLancamento('');
                setNomeEvento('');
                setNomeCampanha('');
                setNomePosicionamento('');
                setNomeOutro('');
                setMensagem('');
              }}
              style={{
                padding: '12px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 Limpar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
