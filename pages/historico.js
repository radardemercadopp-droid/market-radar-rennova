import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Historico() {
  const [inteligencias, setInteligencias] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('inteligenciasRadar') || '[]');
    setInteligencias(dados);
  }, []);

  const dadosFiltrados = filtroTipo 
    ? inteligencias.filter(item => item.tipo === filtroTipo)
    : inteligencias;

  const exportarCSV = () => {
    if (inteligencias.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    const headers = ['Data Criação', 'Nome', 'Tipo', 'Competidor', 'Descrição', 'Data Observação', 'Fonte'];
    const rows = inteligencias.map(item => [
      item.dataCriacao,
      item.nome,
      item.tipo,
      item.competidor,
      item.descricao,
      item.data,
      item.fonte
    ]);

    const csv = [headers, ...rows].map(row => 
      row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `radar-mercado-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportarJSON = () => {
    if (inteligencias.length === 0) {
      alert('Nenhum dado para exportar');
      return;
    }

    const blob = new Blob([JSON.stringify(inteligencias, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `radar-mercado-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const limparDados = () => {
    if (confirm('Tem certeza que quer limpar TODOS os dados?')) {
      localStorage.removeItem('inteligenciasRadar');
      setInteligencias([]);
    }
  };

  const tipos = [...new Set(inteligencias.map(i => i.tipo))];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>📊 Histórico de Inteligências</h1>
        <Link href="/">
          <a style={{
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}>
            ← Voltar ao Formulário
          </a>
        </Link>
      </div>

      <div style={{ backgroundColor: '#f0f0f0', padding: '15px', borderRadius: '4px', marginBottom: '20px' }}>
        <p><strong>Total de registros:</strong> {inteligencias.length}</p>
        <p><strong>Por tipo:</strong> {tipos.map(t => `${t}: ${inteligencias.filter(i => i.tipo === t).length}`).join(' | ')}</p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button onClick={exportarCSV} style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          📥 Exportar CSV
        </button>
        <button onClick={exportarJSON} style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          📥 Exportar JSON
        </button>
        <button onClick={limparDados} style={{
          padding: '10px 20px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '14px'
        }}>
          🗑️ Limpar Todos os Dados
        </button>
      </div>

      {tipos.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <label>Filtrar por tipo: </label>
          <select 
            value={filtroTipo} 
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          >
            <option value="">Todos</option>
            {tipos.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      )}

      {inteligencias.length === 0 ? (
        <p style={{ color: '#999', fontSize: '16px' }}>Nenhum dado salvo ainda. <Link href="/"><a>Preencha o formulário</a></Link> para começar!</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#fff',
            border: '1px solid #ddd'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#333', color: 'white' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Data</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Competidor</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Descrição</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Observação</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Fonte</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((item, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f9f9' : '#fff', borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {new Date(item.dataCriacao).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.nome}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
                    <span style={{ backgroundColor: '#e0e0e0', padding: '4px 8px', borderRadius: '3px' }}>
                      {item.tipo}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{item.competidor}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', maxWidth: '250px', wordBreak: 'break-word' }}>
                    {item.descricao.length > 60 ? item.descricao.substring(0, 60) + '...' : item.descricao}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
                    {item.data}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
                    {item.fonte}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: '10px', color: '#666', fontSize: '12px' }}>
            Mostrando {dadosFiltrados.length} de {inteligencias.length} registros
          </p>
        </div>
      )}
    </div>
  );
}
