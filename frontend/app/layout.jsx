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
                            background: '#ffffff',
                            color: '#332e2a',
                            border: '1px solid #e8ddd3',
                            boxShadow: '0 8px 24px rgba(51,46,42,0.12)'
                        }
                    }}
                />
                {children}
            </body>
        </html>
    );
}
