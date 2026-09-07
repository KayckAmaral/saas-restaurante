'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApiClient from '@/utils/apiClient';

export default function Marca() {

    const router = useRouter();
    const nomeRef = useRef();

    const [usuario, setUsuario] = useState(null);
    const [marcas, setMarcas] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        async function verificarLogin() {
            const data = await ApiClient.get('autenticacao/usuario');
            if (!data) {
                router.replace('/login');
            } else {
                setUsuario(data);
                await carregarMarcas();
            }
        }
        verificarLogin();
    }, []);

    async function carregarMarcas() {
        const data = await ApiClient.get('marca');
        setMarcas(data || []);
    }

    async function salvar(e) {
        e.preventDefault();

        const nome = nomeRef.current.value.trim();
        if (!nome) {
            toast.error('Informe o nome da marca.');
            return;
        }

        setSalvando(true);
        try {
            if (editandoId) {
                const resposta = await ApiClient.put('marca', { id: editandoId, nome });
                if (resposta) {
                    toast.success('Marca atualizada com sucesso!');
                    cancelarEdicao();
                    await carregarMarcas();
                }
            } else {
                const resposta = await ApiClient.post('marca', { nome });
                if (resposta) {
                    toast.success('Marca cadastrada com sucesso!');
                    nomeRef.current.value = '';
                    await carregarMarcas();
                }
            }
        } finally {
            setSalvando(false);
        }
    }

    function editar(marca) {
        setEditandoId(marca.id);
        nomeRef.current.value = marca.nome;
        nomeRef.current.focus();
    }

    function cancelarEdicao() {
        setEditandoId(null);
        nomeRef.current.value = '';
    }

    async function inativar(marca) {
        if (!confirm(`Deseja realmente inativar a marca "${marca.nome}"?`)) return;

        const resposta = await ApiClient.patch(`marca/${marca.id}/inativar`);
        if (resposta) {
            toast.success('Marca inativada com sucesso!');
            if (editandoId === marca.id) cancelarEdicao();
            await carregarMarcas();
        }
    }

    if (!usuario) {
        return (
            <div style={styles.loading}>
                <span style={{ fontSize: '32px' }}>⏳</span>
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>

            {/* Topbar */}
            <div style={styles.topbar}>
                <div style={styles.topbarLeft}>
                    <button onClick={() => router.push('/dashboard')} style={styles.backBtn}>← Voltar</button>
                    <span style={styles.topbarTitle}>🏷️ Gerenciar Marca</span>
                </div>
            </div>

            {/* Conteúdo */}
            <div style={styles.content}>

                {/* Formulário */}
                <form onSubmit={salvar} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>Nome da marca</label>
                        <input
                            ref={nomeRef}
                            type="text"
                            placeholder="Ex.: Coca-Cola"
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formBtns}>
                        <button type="submit" style={styles.btn} disabled={salvando}>
                            {salvando ? 'Salvando...' : editandoId ? 'Atualizar' : 'Cadastrar'}
                        </button>
                        {editandoId && (
                            <button type="button" onClick={cancelarEdicao} style={styles.btnSecundario}>
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {/* Listagem */}
                <div style={styles.tabelaWrap}>
                    {marcas.length === 0 ? (
                        <p style={styles.vazio}>Nenhuma marca cadastrada.</p>
                    ) : (
                        <table style={styles.tabela}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Nome</th>
                                    <th style={{ ...styles.th, width: '160px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {marcas.map(marca => (
                                    <tr key={marca.id}>
                                        <td style={styles.td}>{marca.nome}</td>
                                        <td style={styles.td}>
                                            <button onClick={() => editar(marca)} style={styles.acaoBtn}>Editar</button>
                                            <button onClick={() => inativar(marca)} style={styles.acaoBtnPerigo}>Inativar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    loading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '12px',
        color: 'rgba(255,255,255,0.5)'
    },
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
    },
    topbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '64px',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
    },
    topbarLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '18px'
    },
    topbarTitle: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#e85d04'
    },
    backBtn: {
        padding: '7px 14px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer'
    },
    content: {
        maxWidth: '760px',
        margin: '0 auto',
        padding: '40px 24px'
    },
    form: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '28px'
    },
    field: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.7)'
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none'
    },
    formBtns: {
        display: 'flex',
        gap: '10px'
    },
    btn: {
        padding: '12px 22px',
        background: 'linear-gradient(135deg, #e85d04, #c44d02)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 700,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    btnSecundario: {
        padding: '12px 18px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        color: 'rgba(255,255,255,0.7)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    tabelaWrap: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        overflow: 'hidden'
    },
    tabela: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    th: {
        textAlign: 'left',
        padding: '14px 20px',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
    },
    td: {
        padding: '14px 20px',
        fontSize: '14px',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
    },
    acaoBtn: {
        marginRight: '8px',
        padding: '6px 12px',
        background: 'rgba(232,93,4,0.15)',
        border: '1px solid rgba(232,93,4,0.4)',
        borderRadius: '8px',
        color: '#e85d04',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer'
    },
    acaoBtnPerigo: {
        padding: '6px 12px',
        background: 'rgba(220,53,69,0.12)',
        border: '1px solid rgba(220,53,69,0.35)',
        borderRadius: '8px',
        color: '#ff6b6b',
        fontSize: '12px',
        fontWeight: 600,
        cursor: 'pointer'
    },
    vazio: {
        padding: '32px',
        textAlign: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px'
    }
};
