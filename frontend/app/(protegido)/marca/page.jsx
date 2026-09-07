'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApiClient from '@/utils/apiClient';
import { Factory, Loader2, Pencil, Ban } from 'lucide-react';

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
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div style={styles.content}>

            <div style={styles.header}>
                <Factory size={22} color="var(--primary)" />
                <h1 style={styles.headerTitle}>Gerenciar Marca</h1>
            </div>

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
                                <th style={{ ...styles.th, width: '140px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marcas.map(marca => (
                                <tr key={marca.id}>
                                    <td style={styles.td}>{marca.nome}</td>
                                    <td style={styles.td}>
                                        <button onClick={() => editar(marca)} style={styles.acaoBtn} title="Editar">
                                            <Pencil size={15} />
                                        </button>
                                        <button onClick={() => inativar(marca)} style={styles.acaoBtnPerigo} title="Inativar">
                                            <Ban size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
        color: 'var(--text-muted)'
    },
    content: {
        maxWidth: '760px',
        margin: '0 auto',
        padding: '40px 32px'
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px'
    },
    headerTitle: {
        fontSize: '20px',
        fontWeight: 700,
        color: 'var(--text)'
    },
    form: {
        display: 'flex',
        alignItems: 'flex-end',
        gap: '16px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow)'
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
        color: 'var(--text-muted)'
    },
    input: {
        width: '100%',
        padding: '12px 14px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        color: 'var(--text)',
        fontSize: '15px',
        outline: 'none'
    },
    formBtns: {
        display: 'flex',
        gap: '10px'
    },
    btn: {
        padding: '12px 22px',
        background: 'var(--primary)',
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
        background: 'var(--surface-alt)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        color: 'var(--text-muted)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    tabelaWrap: {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)'
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
        color: 'var(--text-muted)',
        borderBottom: '1px solid var(--border)'
    },
    td: {
        padding: '14px 20px',
        fontSize: '14px',
        color: 'var(--text)',
        borderBottom: '1px solid var(--border)'
    },
    acaoBtn: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '8px',
        padding: '7px',
        background: 'var(--primary-light)',
        border: 'none',
        borderRadius: '8px',
        color: 'var(--primary-dark)',
        cursor: 'pointer'
    },
    acaoBtnPerigo: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7px',
        background: 'var(--danger-light)',
        border: 'none',
        borderRadius: '8px',
        color: 'var(--danger)',
        cursor: 'pointer'
    },
    vazio: {
        padding: '32px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '14px'
    }
};
