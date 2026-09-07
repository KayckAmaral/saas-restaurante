'use client'

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApiClient from '@/utils/apiClient';
import { UtensilsCrossed, CheckCircle2, User, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function Login() {

    const loginRef = useRef();
    const senhaRef = useRef();
    const router = useRouter();
    const [carregando, setCarregando] = useState(false);
    const [mostrarSenha, setMostrarSenha] = useState(false);

    async function autenticar(e) {
        e.preventDefault();

        const login = loginRef.current.value.trim();
        const senha = senhaRef.current.value;

        if (!login || !senha) {
            toast.error('Preencha o login e a senha.');
            return;
        }

        setCarregando(true);
        try {
            const response = await ApiClient.post('autenticacao/token', { login, senha });
            if (response) {
                toast.success(`Bem-vindo, ${response.usuario.nome}!`);
                router.replace('/dashboard');
            } else {
                toast.error('Login ou senha inválidos.');
            }
        } catch {
            toast.error('Erro ao conectar com o servidor.');
        } finally {
            setCarregando(false);
        }
    }

    return (
        <div style={styles.container}>

            {/* Lado esquerdo — visual */}
            <div style={styles.lado}>
                <div style={styles.logoWrap}>
                    <UtensilsCrossed size={44} color="#fff" style={{ marginBottom: '16px' }} />
                    <h1 style={styles.logoTitle}>SaaS Restaurante</h1>
                    <p style={styles.logoSub}>Sistema de Gestão</p>
                </div>
                <div style={styles.taglines}>
                    <p style={styles.tagline}><CheckCircle2 size={16} /> Controle de vendas</p>
                    <p style={styles.tagline}><CheckCircle2 size={16} /> Gestão de estoque</p>
                    <p style={styles.tagline}><CheckCircle2 size={16} /> Fluxo de caixa</p>
                    <p style={styles.tagline}><CheckCircle2 size={16} /> Relatórios completos</p>
                </div>
                <p style={styles.empresa}>J.P. Moreira Silva Restaurante</p>
            </div>

            {/* Lado direito — formulário */}
            <div style={styles.formWrap}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardIcon}><LogIn size={26} color="var(--primary)" /></div>
                        <h2 style={styles.cardTitle}>Acesse sua conta</h2>
                        <p style={styles.cardSub}>Digite suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={autenticar} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Login</label>
                            <div style={styles.inputWrap}>
                                <User size={16} style={styles.inputIcon} />
                                <input
                                    ref={loginRef}
                                    type="text"
                                    placeholder="Seu login"
                                    style={styles.input}
                                    autoComplete="username"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Senha</label>
                            <div style={styles.inputWrap}>
                                <Lock size={16} style={styles.inputIcon} />
                                <input
                                    ref={senhaRef}
                                    type={mostrarSenha ? 'text' : 'password'}
                                    placeholder="Sua senha"
                                    style={{ ...styles.input, paddingRight: '44px' }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarSenha(v => !v)}
                                    style={styles.eyeBtn}
                                    tabIndex={-1}
                                >
                                    {mostrarSenha ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={carregando ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
                            disabled={carregando}
                        >
                            {carregando ? (
                                <span style={styles.spinner}>
                                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Entrando...
                                </span>
                            ) : (
                                'Entrar'
                            )}
                        </button>
                    </form>

                    <p style={styles.footer}>
                        © 2026 J.P. Moreira Silva Restaurante
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg)'
    },
    lado: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(160deg, var(--primary) 0%, var(--primary-dark) 100%)',
    },
    logoWrap: {
        marginBottom: '48px'
    },
    logoTitle: {
        fontSize: '32px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '6px'
    },
    logoSub: {
        fontSize: '16px',
        color: 'rgba(255,255,255,0.75)',
        letterSpacing: '2px',
        textTransform: 'uppercase'
    },
    taglines: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        marginBottom: '60px'
    },
    tagline: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '15px',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '0.3px'
    },
    empresa: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.6)',
        borderTop: '1px solid rgba(255,255,255,0.25)',
        paddingTop: '24px'
    },
    formWrap: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px'
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '20px',
        padding: '40px 36px',
        boxShadow: 'var(--shadow)'
    },
    cardHeader: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    cardIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: 'var(--primary-light)',
        margin: '0 auto 14px'
    },
    cardTitle: {
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '6px'
    },
    cardSub: {
        fontSize: '14px',
        color: 'var(--text-muted)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    label: {
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--text-muted)',
        letterSpacing: '0.5px'
    },
    inputWrap: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '14px',
        color: 'var(--text-muted)',
        pointerEvents: 'none'
    },
    input: {
        width: '100%',
        padding: '12px 14px 12px 42px',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
        borderRadius: '10px',
        color: 'var(--text)',
        fontSize: '15px',
        outline: 'none',
        transition: 'border 0.2s',
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        display: 'flex',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--text-muted)',
        padding: '4px'
    },
    btn: {
        marginTop: '8px',
        padding: '14px',
        background: 'var(--primary)',
        border: 'none',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '16px',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'opacity 0.2s',
        letterSpacing: '0.5px'
    },
    btnDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed'
    },
    spinner: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
    },
    footer: {
        marginTop: '28px',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-muted)'
    }
};
