import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
    title: 'SaaS Restaurante',
    description: 'Sistema de Gestão do Restaurante J.P. Moreira Silva'
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <body>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: '#1a1a2e',
                            color: '#e0e0e0',
                            border: '1px solid rgba(232,93,4,0.3)'
                        }
                    }}
                />
                {children}
            </body>
        </html>
    );
}
