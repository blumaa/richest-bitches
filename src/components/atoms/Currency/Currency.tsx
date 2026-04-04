export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

interface CurrencyProps {
  amount: number;
  className?: string;
}

export function Currency({ amount, className }: CurrencyProps) {
  return <span className={className}>{formatCurrency(amount)}</span>;
}
