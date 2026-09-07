'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import ApiClient from '@/utils/apiClient';

export default function Dashboard() {

    const router = useRouter();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        async function verificarLogin() {
            const data = await ApiClient.get('autenticacao/usuario');
            if (!data) {
                router.replace('/login');
            } else {
                setUsuario(data);
            }
        }
        verificarLogin();
    }, []);

    async function sair() {
        await ApiClient.post('autenticacao/logout', {});
        toast.success('Até logo!');
        router.replace('/login');
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
                    <span style={styles.topbarIcon}>🍽️</span>
                    <span style={styles.topbarTitle}>SaaS Restaurante</span>
                </div>
                <div style={styles.topbarRight}>
                    <span style={styles.userBadge}>👤 {usuario.nome}</span>
                    <button onClick={sair} style={styles.logoutBtn}>Sair</button>
                </div>
            </div>

            {/* Conteúdo */}
            <div style={styles.content}>
                <div style={styles.welcome}>
                    <h1 style={styles.welcomeTitle}>
                        Olá, {usuario.nome.split(' ')[0]}! 👋
                    </h1>
                    <p style={styles.welcomeSub}>
                        Bem-vindo ao sistema de gestão do restaurante.
                    </p>
                </div>

                {/* Cards de módulos */}
                <div style={styles.grid}>
                    {modulos.map((m, i) => (
                        <div
                            key={i}
                            style={m.rota ? { ...styles.card, cursor: 'pointer' } : styles.card}
                            onClick={() => m.rota && router.push(m.rota)}
                        >
                            <div style={styles.cardIcon}>{m.icon}</div>
                            <h3 style={styles.cardTitle}>{m.titulo}</h3>
                            <p style={styles.cardDesc}>{m.desc}</p>
                            <span style={styles.cardBadge}>{m.badge}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const modulos = [
    { icon: '🛒', titulo: 'Vendas',         desc: 'Registre vendas à vista e a prazo',     badge: 'Em breve' },
    { icon: '📦', titulo: 'Estoque',         desc: 'Controle entradas e uso de insumos',    badge: 'Em breve' },
    { icon: '💰', titulo: 'Caixa',           desc: 'Abra e feche o caixa diário',           badge: 'Em breve' },
    { icon: '👤', titulo: 'Pessoa Física',   desc: 'Clientes e colaboradores',              badge: 'Disponível', rota: '/pessoa-fisica' },
    { icon: '🏢', titulo: 'Pessoa Jurídica', desc: 'Empresas e fornecedores',               badge: 'Disponível', rota: '/pessoa-juridica' },
    { icon: '🏷️', titulo: 'Produtos',        desc: 'Gerencie produtos e insumos',           badge: 'Em breve' },
    { icon: '🏭', titulo: 'Marca',           desc: 'Cadastre as marcas dos produtos',       badge: 'Disponível', rota: '/marca' },
    { icon: '📊', titulo: 'Relatórios',      desc: 'Vendas, estoque e fluxo de caixa',      badge: 'Em breve' },
];

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
        gap: '10px'
    },
    topbarIcon: { fontSize: '22px' },
    topbarTitle: {
        fontSize: '18px',
        fontWeight: 700,
        color: '#e85d04'
    },
    topbarRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    userBadge: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.6)',
        background: 'rgba(255,255,255,0.06)',
        padding: '6px 14px',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)'
    },
    logoutBtn: {
        padding: '7px 18px',
        background: 'rgba(232,93,4,0.15)',
        border: '1px solid rgba(232,93,4,0.4)',
        borderRadius: '8px',
        color: '#e85d04',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer'
    },
    content: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 24px'
    },
    welcome: {
        marginBottom: '40px'
    },
    welcomeTitle: {
        fontSize: '28px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '6px'
    },
    welcomeSub: {
        fontSize: '15px',
        color: 'rgba(255,255,255,0.45)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px'
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '28px 24px',
        transition: 'transform 0.2s, border-color 0.2s',
        cursor: 'default'
    },
    cardIcon: {
        fontSize: '32px',
        marginBottom: '14px',
        display: 'block'
    },
    cardTitle: {
        fontSize: '17px',
        fontWeight: 700,
        color: '#fff',
        marginBottom: '6px'
    },
    cardDesc: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.45)',
        marginBottom: '16px',
        lineHeight: '1.5'
    },
    cardBadge: {
        fontSize: '11px',
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: '20px',
        background: 'rgba(232,93,4,0.15)',
        color: '#e85d04',
        border: '1px solid rgba(232,93,4,0.3)',
        letterSpacing: '0.3px'
    }
};
