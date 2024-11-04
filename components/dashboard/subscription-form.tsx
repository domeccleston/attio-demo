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
    <form onSubmit={handleSubmit} className="flex flex-col h-[400px]">
      <div className="flex-grow space-y-6">
        <PaymentElement />

        {errorMessage && (
          <div className="text-sm text-red-500">{errorMessage}</div>
        )}
      </div>

      <div className="flex justify-between space-x-2 mt-auto pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-5 py-2 w-[110px]"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-5 py-2 w-[140px]"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
    </form>
  );
}
