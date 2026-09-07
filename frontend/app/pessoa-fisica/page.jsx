'use client'

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApiClient from '@/utils/apiClient';

export default function PessoaFisica() {

    const router = useRouter();
    const nomeRef = useRef();
    const telefoneRef = useRef();
    const enderecoRef = useRef();
    const cpfRef = useRef();
    const dataNascimentoRef = useRef();
    const loginRef = useRef();
    const senhaRef = useRef();
    const idPessoaJuridicaRef = useRef();

    const [usuario, setUsuario] = useState(null);
    const [pessoas, setPessoas] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [editandoId, setEditandoId] = useState(null);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        async function verificarLogin() {
            const data = await ApiClient.get('autenticacao/usuario');
            if (!data) {
                router.replace('/login');
            } else {
                setUsuario(data);
                await Promise.all([carregarPessoas(), carregarEmpresas()]);
            }
        }
        verificarLogin();
    }, []);

    async function carregarPessoas() {
        const data = await ApiClient.get('pessoa-fisica');
        setPessoas(data || []);
    }

    async function carregarEmpresas() {
        const data = await ApiClient.get('pessoa-juridica');
        setEmpresas(data || []);
    }

    function formatarData(data) {
        return data ? String(data).slice(0, 10) : '';
    }

    async function salvar(e) {
        e.preventDefault();

        const nome = nomeRef.current.value.trim();
        if (!nome) {
            toast.error('O nome é obrigatório.');
            return;
        }

        const idPessoaJuridica = idPessoaJuridicaRef.current.value || null;

        const body = {
            nome,
            telefone: telefoneRef.current.value.trim() || null,
            endereco: enderecoRef.current.value.trim() || null,
            cpf: cpfRef.current.value.trim() || null,
            dataNascimento: dataNascimentoRef.current.value || null,
            login: loginRef.current.value.trim() || null,
            idPessoaJuridica
        };

        setSalvando(true);
        try {
            if (editandoId) {
                const resposta = await ApiClient.put('pessoa-fisica', { id: editandoId, ...body });
                if (resposta) {
                    toast.success('Pessoa atualizada com sucesso!');
                    cancelarEdicao();
                    await carregarPessoas();
                }
            } else {
                const senha = senhaRef.current.value.trim() || null;
                const resposta = await ApiClient.post('pessoa-fisica', { ...body, senha });
                if (resposta) {
                    toast.success('Pessoa cadastrada com sucesso!');
                    limparFormulario();
                    await carregarPessoas();
                }
            }
        } finally {
            setSalvando(false);
        }
    }

    function limparFormulario() {
        nomeRef.current.value = '';
        telefoneRef.current.value = '';
        enderecoRef.current.value = '';
        cpfRef.current.value = '';
        dataNascimentoRef.current.value = '';
        loginRef.current.value = '';
        if (senhaRef.current) senhaRef.current.value = '';
        idPessoaJuridicaRef.current.value = '';
    }

    function editar(pessoa) {
        setEditandoId(pessoa.id);
        nomeRef.current.value = pessoa.nome || '';
        telefoneRef.current.value = pessoa.telefone || '';
        enderecoRef.current.value = pessoa.endereco || '';
        cpfRef.current.value = pessoa.cpf || '';
        dataNascimentoRef.current.value = formatarData(pessoa.dataNascimento);
        loginRef.current.value = pessoa.login || '';
        idPessoaJuridicaRef.current.value = pessoa.idPessoaJuridica || '';
        nomeRef.current.focus();
    }

    function cancelarEdicao() {
        setEditandoId(null);
        limparFormulario();
    }

    async function inativar(pessoa) {
        if (!confirm(`Deseja realmente inativar "${pessoa.nome}"?`)) return;

        const resposta = await ApiClient.patch(`pessoa-fisica/${pessoa.id}/inativar`);
        if (resposta) {
            toast.success('Pessoa inativada com sucesso!');
            if (editandoId === pessoa.id) cancelarEdicao();
            await carregarPessoas();
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
                    <span style={styles.topbarTitle}>👤 Gerenciar Pessoa Física</span>
                </div>
            </div>

            {/* Conteúdo */}
            <div style={styles.content}>

                {/* Formulário */}
                <form onSubmit={salvar} style={styles.form}>
                    <div style={styles.grid2}>
                        <div style={styles.field}>
                            <label style={styles.label}>Nome</label>
                            <input ref={nomeRef} type="text" placeholder="Ex.: João Silva" style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>CPF</label>
                            <input ref={cpfRef} type="text" placeholder="000.000.000-00" style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Telefone</label>
                            <input ref={telefoneRef} type="text" placeholder="(44) 99999-9999" style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Data de nascimento</label>
                            <input ref={dataNascimentoRef} type="date" style={styles.input} />
                        </div>
                        <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                            <label style={styles.label}>Endereço</label>
                            <input ref={enderecoRef} type="text" placeholder="Rua das Flores, 123" style={styles.input} />
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Empresa vinculada (opcional)</label>
                            <select ref={idPessoaJuridicaRef} style={styles.input}>
                                <option value="">Nenhuma</option>
                                {empresas.map(empresa => (
                                    <option key={empresa.id} value={empresa.id}>{empresa.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div style={styles.field}>
                            <label style={styles.label}>Login (opcional — acesso ao sistema)</label>
                            <input ref={loginRef} type="text" placeholder="usuario.sistema" style={styles.input} />
                        </div>
                        {!editandoId && (
                            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
                                <label style={styles.label}>Senha (só é necessária se preencher o login)</label>
                                <input ref={senhaRef} type="password" placeholder="••••••••" style={styles.input} />
                            </div>
                        )}
                    </div>
                    {editandoId && (
                        <p style={styles.aviso}>A senha não pode ser alterada por aqui.</p>
                    )}
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
                    {pessoas.length === 0 ? (
                        <p style={styles.vazio}>Nenhuma pessoa física cadastrada.</p>
                    ) : (
                        <table style={styles.tabela}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Nome</th>
                                    <th style={styles.th}>CPF</th>
                                    <th style={styles.th}>Telefone</th>
                                    <th style={styles.th}>Login</th>
                                    <th style={{ ...styles.th, width: '160px' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pessoas.map(pessoa => (
                                    <tr key={pessoa.id}>
                                        <td style={styles.td}>{pessoa.nome}</td>
                                        <td style={styles.td}>{pessoa.cpf || '—'}</td>
                                        <td style={styles.td}>{pessoa.telefone || '—'}</td>
                                        <td style={styles.td}>{pessoa.login || '—'}</td>
                                        <td style={styles.td}>
                                            <button onClick={() => editar(pessoa)} style={styles.acaoBtn}>Editar</button>
                                            <button onClick={() => inativar(pessoa)} style={styles.acaoBtnPerigo}>Inativar</button>
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
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 24px'
    },
    form: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '28px'
    },
    grid2: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '18px'
    },
    field: {
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
    aviso: {
        fontSize: '12px',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '14px'
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
        overflow: 'auto'
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
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        whiteSpace: 'nowrap'
    },
    td: {
        padding: '14px 20px',
        fontSize: '14px',
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        whiteSpace: 'nowrap'
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
