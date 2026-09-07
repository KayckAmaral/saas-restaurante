'use client'

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    UtensilsCrossed, PanelLeftClose, PanelLeftOpen, LayoutDashboard,
    ShoppingCart, Package, Wallet, User, Building2, Tag, Factory,
    BarChart3, LogOut, Loader2
} from 'lucide-react';
import ApiClient from '@/utils/apiClient';

const ITENS_MENU = [
    { rota: '/dashboard',        label: 'Início',          icon: LayoutDashboard },
    { rota: '/pessoa-fisica',    label: 'Pessoa Física',    icon: User },
    { rota: '/pessoa-juridica',  label: 'Pessoa Jurídica',  icon: Building2 },
    { rota: '/marca',            label: 'Marca',            icon: Factory },
    { rota: null,                label: 'Produtos',         icon: Tag,          emBreve: true },
    { rota: null,                label: 'Vendas',           icon: ShoppingCart, emBreve: true },
    { rota: null,                label: 'Estoque',          icon: Package,      emBreve: true },
    { rota: null,                label: 'Caixa',            icon: Wallet,       emBreve: true },
    { rota: null,                label: 'Relatórios',       icon: BarChart3,    emBreve: true },
];

// Telas com formulário: a sidebar abre recolhida por padrão pra dar espaço ao conteúdo
const ROTAS_COM_FORMULARIO = ['/marca', '/pessoa-fisica', '/pessoa-juridica'];

export default function AppShell({ children }) {

    const pathname = usePathname();
    const router = useRouter();
    const [usuario, setUsuario] = useState(null);
    const [recolhida, setRecolhida] = useState(() => ROTAS_COM_FORMULARIO.includes(pathname));

    useEffect(() => {
        setRecolhida(ROTAS_COM_FORMULARIO.includes(pathname));
    }, [pathname]);

    useEffect(() => {
        ApiClient.get('autenticacao/usuario').then(data => {
            if (data) setUsuario(data);
        });
    }, []);

    async function sair() {
        await ApiClient.post('autenticacao/logout', {});
        toast.success('Até logo!');
        router.replace('/login');
    }

    const iniciais = usuario?.nome
        ? usuario.nome.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase()
        : '';

    return (
        <div style={styles.container}>
            <aside style={{ ...styles.sidebar, width: recolhida ? '76px' : '240px' }}>

                <div style={{ ...styles.topo, flexDirection: recolhida ? 'column' : 'row' }}>
                    <div style={styles.marca}>
                        <UtensilsCrossed size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                        {!recolhida && <span style={styles.marcaTexto}>SaaS Restaurante</span>}
                    </div>
                    <button
                        onClick={() => setRecolhida(v => !v)}
                        style={styles.toggleBtn}
                        title={recolhida ? 'Expandir menu' : 'Recolher menu'}
                    >
                        {recolhida ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                    </button>
                </div>

                <nav style={styles.nav}>
                    {ITENS_MENU.map((item) => {
                        const Icone = item.icon;
                        const ativo = item.rota && pathname === item.rota;
                        return (
                            <button
                                key={item.label}
                                onClick={() => item.rota && router.push(item.rota)}
                                disabled={item.emBreve}
                                title={recolhida ? item.label : undefined}
                                style={{
                                    ...styles.navItem,
                                    ...(ativo ? styles.navItemAtivo : {}),
                                    ...(item.emBreve ? styles.navItemDesabilitado : {}),
                                    justifyContent: recolhida ? 'center' : 'flex-start'
                                }}
                            >
                                <Icone size={19} style={{ flexShrink: 0 }} />
                                {!recolhida && (
                                    <span style={styles.navLabel}>
                                        {item.label}
                                        {item.emBreve && <span style={styles.badgeEmBreve}>em breve</span>}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                <div style={styles.rodape}>
                    {usuario ? (
                        <>
                            <div style={{ ...styles.usuarioBox, justifyContent: recolhida ? 'center' : 'flex-start' }}>
                                <div style={styles.avatar}>{iniciais}</div>
                                {!recolhida && <span style={styles.usuarioNome}>{usuario.nome}</span>}
                            </div>
                            <button
                                onClick={sair}
                                title="Sair"
                                style={{ ...styles.sairBtn, justifyContent: recolhida ? 'center' : 'flex-start' }}
                            >
                                <LogOut size={18} style={{ flexShrink: 0 }} />
                                {!recolhida && <span>Sair</span>}
                            </button>
                        </>
                    ) : (
                        <div style={styles.usuarioBox}>
                            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    )}
                </div>
            </aside>

            <main style={styles.main}>
                {children}
            </main>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg)'
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        transition: 'width 0.2s ease',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden'
    },
    topo: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '16px',
        borderBottom: '1px solid var(--border)',
        minHeight: '64px'
    },
    marca: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        overflow: 'hidden'
    },
    marcaTexto: {
        fontSize: '15px',
        fontWeight: 700,
        color: 'var(--primary)',
        whiteSpace: 'nowrap'
    },
    toggleBtn: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        background: 'transparent',
        border: 'none',
        borderRadius: '8px',
        color: 'var(--text-muted)',
        cursor: 'pointer',
        flexShrink: 0
    },
    nav: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '16px 12px',
        flex: 1,
        overflowY: 'auto'
    },
    navItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 12px',
        background: 'transparent',
        border: 'none',
        borderRadius: '10px',
        color: 'var(--text-muted)',
        fontSize: '14px',
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap'
    },
    navItemAtivo: {
        background: 'var(--primary-light)',
        color: 'var(--primary-dark)'
    },
    navItemDesabilitado: {
        cursor: 'not-allowed',
        opacity: 0.5
    },
    navLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    badgeEmBreve: {
        fontSize: '9px',
        fontWeight: 700,
        padding: '2px 6px',
        borderRadius: '20px',
        background: 'var(--surface-alt)',
        color: 'var(--text-muted)',
        letterSpacing: '0.3px',
        textTransform: 'uppercase'
    },
    rodape: {
        borderTop: '1px solid var(--border)',
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    usuarioBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 4px',
        overflow: 'hidden'
    },
    avatar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: 'var(--primary)',
        color: '#fff',
        fontSize: '12px',
        fontWeight: 700,
        flexShrink: 0
    },
    usuarioNome: {
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--text)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    sairBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '9px 8px',
        background: 'transparent',
        border: 'none',
        borderRadius: '10px',
        color: 'var(--danger)',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer'
    },
    main: {
        flex: 1,
        minWidth: 0
    }
};
