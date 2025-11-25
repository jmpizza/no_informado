// src/constants/iconMap.js
import { DollarSign, CreditCard, Smartphone, Wallet, Info } from "lucide-react";

// Diccionario inicial de íconos
export let ICON_MAP = {
  "Efectivo": DollarSign,
  "Transferencia": CreditCard,
  "Datáfono": CreditCard,
  "Billetera digital": Smartphone,
  "Otros": Wallet,
};

// Función para agregar nuevos íconos dinámicamente
export function addIcon(name, icon) {
  ICON_MAP[name] = icon;
}
