export function formatToNaira(amount: number) {
  let formattedAmount: string;

  if (amount >= 1_000_000) {
    formattedAmount = `₦${(amount / 1_000_000).toFixed(1)}M`;
  } else if (amount >= 100_000) {
    formattedAmount = `₦${(amount / 1_000).toFixed(1)}k`;
  } else {
    formattedAmount = amount.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return formattedAmount;
}
