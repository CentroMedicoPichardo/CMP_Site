
import type {Metadata} from 'next';
import type {ReactNode} from 'react';

export const metadata: Metadata = {
  title: 'Restablecer contraseña | Centro Médico Pichardo',
  robots: {
    index: false,
    follow: false,
  },
  referrer: 'no-referrer',
};

export default function RestablecerPasswordLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
