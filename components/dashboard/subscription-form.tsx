import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";

interface SubscriptionFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function SubscriptionForm({ onSuccess, onBack }: SubscriptionFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);

    try {
      const result = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${
            window.location.origin
          }/dashboard?session_id=${localStorage.getItem("pendingTeamName")}`,
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      } else {
        onSuccess();
      }
    } catch (e) {
      console.error("Error:", e);
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      {errorMessage && (
        <div className="text-sm text-red-500">{errorMessage}</div>
      )}

      <div className="flex justify-between space-x-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-5 py-2"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 py-2"
        >
          {isLoading ? "Processing..." : "Set up subscription"}
        </button>
      </div>
    </form>
  );
}
