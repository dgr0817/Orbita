import './globals.css';

export const metadata = {
  title: 'Órbita | Registro de empresa',
  description: 'Registro de empresa para Órbita.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
