'use client'

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApiClient from '@/utils/apiClient';

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
                    <div style={styles.logoIcon}>🍽️</div>
                    <h1 style={styles.logoTitle}>SaaS Restaurante</h1>
                    <p style={styles.logoSub}>Sistema de Gestão</p>
                </div>
                <div style={styles.taglines}>
                    <p style={styles.tagline}>✅ Controle de vendas</p>
                    <p style={styles.tagline}>✅ Gestão de estoque</p>
                    <p style={styles.tagline}>✅ Fluxo de caixa</p>
                    <p style={styles.tagline}>✅ Relatórios completos</p>
                </div>
                <p style={styles.empresa}>J.P. Moreira Silva Restaurante</p>
            </div>

            {/* Lado direito — formulário */}
            <div style={styles.formWrap}>
                <div style={styles.card}>
                    <div style={styles.cardHeader}>
                        <div style={styles.cardIcon}>🔐</div>
                        <h2 style={styles.cardTitle}>Acesse sua conta</h2>
                        <p style={styles.cardSub}>Digite suas credenciais para continuar</p>
                    </div>

                    <form onSubmit={autenticar} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Login</label>
                            <div style={styles.inputWrap}>
                                <span style={styles.inputIcon}>👤</span>
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
                                <span style={styles.inputIcon}>🔒</span>
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
                                    {mostrarSenha ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            style={carregando ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
                            disabled={carregando}
                        >
                            {carregando ? (
                                <span style={styles.spinner}>⏳ Entrando...</span>
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
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    },
    lado: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'linear-gradient(160deg, rgba(232,93,4,0.15) 0%, transparent 60%)',
        borderRight: '1px solid rgba(255,255,255,0.06)'
    },
    logoWrap: {
        marginBottom: '48px'
    },
    logoIcon: {
        fontSize: '56px',
        marginBottom: '16px',
        display: 'block'
    },
    logoTitle: {
        fontSize: '32px',
        fontWeight: 700,
        color: '#e85d04',
        marginBottom: '6px'
    },
    logoSub: {
        fontSize: '16px',
        color: 'rgba(255,255,255,0.5)',
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
        fontSize: '15px',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: '0.3px'
    },
    empresa: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
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
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '20px',
        padding: '40px 36px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
    },
    cardHeader: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    cardIcon: {
        fontSize: '40px',
        marginBottom: '12px',
        display: 'block'
    },
    cardTitle: {
        fontSize: '22px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '6px'
    },
    cardSub: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.45)'
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
        color: 'rgba(255,255,255,0.7)',
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
        fontSize: '16px',
        pointerEvents: 'none'
    },
    input: {
        width: '100%',
        padding: '12px 14px 12px 42px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '10px',
        color: '#fff',
        fontSize: '15px',
        outline: 'none',
        transition: 'border 0.2s',
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '4px'
    },
    btn: {
        marginTop: '8px',
        padding: '14px',
        background: 'linear-gradient(135deg, #e85d04, #c44d02)',
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
        color: 'rgba(255,255,255,0.2)'
    }
};
