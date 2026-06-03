import { type LucideIcon } from 'lucide-react';
import { Smartphone, Wallet, CreditCard } from 'lucide-react';

export interface PaymentMethod {
  name: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  iconColor: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    name: 'Orange Money',
    sub: 'Rapide et sécurisé',
    icon: Smartphone,
    color: 'bg-[#ff7900]/10',
    iconColor: 'text-[#ff7900]',
  },
  {
    name: 'Wave',
    sub: 'Frais réduits',
    icon: Wallet,
    color: 'bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    name: 'Moov Money',
    sub: 'Paiement mobile fictif',
    icon: Wallet,
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    name: 'MTN MoMo',
    sub: 'Paiement instantané',
    icon: Smartphone,
    color: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    name: 'Carte Bancaire',
    sub: 'Visa, Mastercard',
    icon: CreditCard,
    color: 'bg-brand-surface-low',
    iconColor: 'text-brand-primary',
  },
];
