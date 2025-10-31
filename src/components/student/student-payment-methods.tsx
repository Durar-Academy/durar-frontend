"use client";

import axios from "axios";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Card = {
  id: string;
  cardType: string;
  last4: string;
  preferred: boolean;
};

export function StudentPaymentMethods({
  open,
  onOpenChange,
  addNew,
  cardsFromBackend = [],
}: {
  open: boolean;
  onOpenChange: () => void;
  addNew?: () => void;
  cardsFromBackend: Card[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>(cardsFromBackend);
  const [loading, setLoading] = useState(false);

  const cardLogos: Record<string, string> = {
    visa: "/logos_visa.svg",
    mastercard: "/logos_mastercard.svg",
    verve: "/logos_verve.svg",
  };

  const cardStyles: Record<string, string> = {
    visa: "bg-[#224DBA]",
    mastercard: "bg-[#040B1C]",
    verve: "bg-[#F7931A]",
  };

  const getCardLogo = (cardType: string): string => {
    return cardLogos[cardType.trim().toLowerCase()] || "/logos_default.svg";
  };

  const getCardBg = (cardType: string): string => {
    return cardStyles[cardType.trim().toLowerCase()] || "bg-gray-200";
  };

  const handleSelectCard = async (cardId: string) => {
    setSelectedId(cardId);
    setLoading(true);

    try {
      const response = await axios.put(`/payment-method/${cardId}/preferred`);

      if (response.data.success) {
        toast.success(response.data.message || "Card updated as preferred");

        const updatedCards = cards.map((card) => ({
          ...card,
          preferred: card.id === cardId,
        }));
        setCards(updatedCards);
      } else {
        toast.error("Something went wrong updating your card.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to set card as preferred.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[500px] h-4/5 overflow-y-scroll hide-scrollbar"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>Select a payment option to continue</DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-6">
          <fieldset disabled={loading} className="flex flex-col gap-3 disabled:opacity-50">
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleSelectCard(card.id)}
                className={`card px-4 py-5 border flex items-center gap-6 rounded-xl cursor-pointer transition-colors ${
                  selectedId === card.id || card.preferred
                    ? "border-orange bg-orange/10"
                    : "border-shade-3 hover:bg-shade-1"
                }`}
              >
                <div
                  className={`w-32 h-20 rounded-xl flex items-center justify-center ${getCardBg(
                    card.cardType,
                  )}`}
                >
                  <Image
                    src={getCardLogo(card.cardType)}
                    width={58}
                    height={24}
                    alt={`${card.cardType} Icon`}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2 items-center">
                    <h3 className="text-high font-semibold text-xl">**** {card.last4}</h3>
                    {card.preferred && (
                      <p className="text-orange bg-orange/20 rounded-full py-1 px-3 text-sm font-medium text-center w-fit">
                        Primary
                      </p>
                    )}
                  </div>
                  <p className="text-low font-medium text-base capitalize">
                    {card.cardType.trim()}
                  </p>
                </div>
              </div>
            ))}

            <button
              className="text-orange flex items-center gap-2 cursor-pointer"
              onClick={addNew}
              disabled={loading}
            >
              <Plus className="w-6 h-6" />
              <span>Add New Card</span>
            </button>
          </fieldset>

          <fieldset disabled={loading} className="disabled:opacity-50">
            <div
              onClick={() => setSelectedId("bank")}
              className={`card px-4 py-5 border flex items-center gap-6 rounded-xl cursor-pointer transition-colors ${
                selectedId === "bank"
                  ? "border-orange bg-orange/10"
                  : "border-shade-3 hover:bg-shade-1"
              }`}
            >
              <div className="w-32 h-20 rounded-xl bg-gradient-to-r from-green to-orange flex items-center justify-center">
                <Image src={"/bank.svg"} width={32} height={32} alt="Bank Icon" />
              </div>

              <div className="flex flex-col gap-3">
                <h3 className="text-high font-semibold text-xl">Pay with Bank Transfer</h3>
                <p className="text-low font-medium text-base">Make Payment</p>
              </div>
            </div>
          </fieldset>
        </section>
      </DialogContent>
    </Dialog>
  );
}
