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

export function formatDateAndTime(isoDateString: Date) {
  const date = new Date(isoDateString);
  const formattedDate = date.toISOString().split("T")[0];

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

export function formatToReadableId(id: string, prefix: string): string {
  const numbers = id.replace(/[^0-9]/g, "");
  const lastFiveDigits = numbers.slice(-5).padStart(5, "0");
  return `${prefix}-${lastFiveDigits}`;
}
