'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiClient from '@/utils/apiClient';
import {
    Loader2, ShoppingCart, Package, Wallet, User, Building2, Tag, Factory, BarChart3
} from 'lucide-react';

const modulos = [
    { icon: ShoppingCart, titulo: 'Vendas',         desc: 'Registre vendas à vista e a prazo',     badge: 'Em breve' },
    { icon: Package,      titulo: 'Estoque',         desc: 'Controle entradas e uso de insumos',    badge: 'Em breve' },
    { icon: Wallet,       titulo: 'Caixa',           desc: 'Abra e feche o caixa diário',           badge: 'Em breve' },
    { icon: User,         titulo: 'Pessoa Física',   desc: 'Clientes e colaboradores',              badge: 'Disponível', rota: '/pessoa-fisica' },
    { icon: Building2,    titulo: 'Pessoa Jurídica', desc: 'Empresas e fornecedores',               badge: 'Disponível', rota: '/pessoa-juridica' },
    { icon: Tag,          titulo: 'Produtos',        desc: 'Gerencie produtos e insumos',           badge: 'Em breve' },
    { icon: Factory,      titulo: 'Marca',           desc: 'Cadastre as marcas dos produtos',       badge: 'Disponível', rota: '/marca' },
    { icon: BarChart3,    titulo: 'Relatórios',      desc: 'Vendas, estoque e fluxo de caixa',      badge: 'Em breve' },
];

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
            <div style={styles.welcome}>
                <h1 style={styles.welcomeTitle}>Olá, {usuario.nome.split(' ')[0]}!</h1>
                <p style={styles.welcomeSub}>Bem-vindo ao sistema de gestão do restaurante.</p>
            </div>

            <div style={styles.grid}>
                {modulos.map((m, i) => {
                    const Icone = m.icon;
                    return (
                        <div
                            key={i}
                            style={m.rota ? { ...styles.card, cursor: 'pointer' } : styles.card}
                            onClick={() => m.rota && router.push(m.rota)}
                        >
                            <div style={styles.cardIcon}>
                                <Icone size={22} color="var(--primary)" />
                            </div>
                            <h3 style={styles.cardTitle}>{m.titulo}</h3>
                            <p style={styles.cardDesc}>{m.desc}</p>
                            <span
                                style={m.rota ? styles.cardBadge : { ...styles.cardBadge, ...styles.cardBadgeMuted }}
                            >
                                {m.badge}
                            </span>
                        </div>
                    );
                })}
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
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '40px 32px'
    },
    welcome: {
        marginBottom: '36px'
    },
    welcomeTitle: {
        fontSize: '26px',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '6px'
    },
    welcomeSub: {
        fontSize: '14px',
        color: 'var(--text-muted)'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '18px'
    },
    card: {
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px 22px',
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.15s, border-color 0.15s',
        cursor: 'default'
    },
    cardIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '44px',
        height: '44px',
        borderRadius: '12px',
        background: 'var(--primary-light)',
        marginBottom: '14px'
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: '6px'
    },
    cardDesc: {
        fontSize: '13px',
        color: 'var(--text-muted)',
        marginBottom: '16px',
        lineHeight: '1.5'
    },
    cardBadge: {
        fontSize: '11px',
        fontWeight: 600,
        padding: '3px 10px',
        borderRadius: '20px',
        background: 'var(--primary-light)',
        color: 'var(--primary-dark)',
        letterSpacing: '0.3px'
    },
    cardBadgeMuted: {
        background: 'var(--surface-alt)',
        color: 'var(--text-muted)'
    }
};
