import AppShell from '@/components/AppShell';

export default function LayoutProtegido({ children }) {
    return (
        <AppShell>
            {children}
        </AppShell>
    );
}
