"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import { ArrowUpRight, BarChart2 } from "lucide-react";
import { useStripe } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useOrganizationList, useUser } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularGauge } from "@/components/ui/gauge";
import { createTeam } from "@/app/actions/create-team";
import { sampleModels } from "@/data/models";
import { Header } from "@/components/dashboard/header";
import { Tabs } from "@/components/dashboard/tabs";
import { SubscriptionForm } from "@/components/dashboard/subscription-form";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formStage, setFormStage] = useState<"team" | "billing">("team");
  const [clientSecret, setClientSecret] = useState<string>();
  const [nameError, setNameError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setWorkspaces] = useState<any[]>([]);

  const router = useRouter();
  const stripe = useStripe();
  const formRef = useRef<HTMLFormElement>(null);
  const { userMemberships, isLoaded } = useOrganizationList();

  const { user } = useUser();

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsLoading(true);
    const formData = new FormData(formRef.current);

    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName: formData.get("teamName"),
        }),
      });

      const data = (await response.json()) as
        | { clientSecret: string }
        | { error: string };

      if (!response.ok) {
        setNameError(
          "error" in data ? data.error : "An unexpected error occurred"
        );
        return;
      }

      if ("clientSecret" in data) {
        setNameError(undefined);
        localStorage.setItem(
          "pendingTeamName",
          formData.get("teamName") as string
        );
        setClientSecret(data.clientSecret);
        setFormStage("billing");
      }
    } catch (error) {
      console.error("Error setting up subscription:", error);
      setNameError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscriptionSuccess = async () => {
    try {
      // Get stored team name
      const storedTeamName = localStorage.getItem("pendingTeamName");
      if (!storedTeamName) return;

      const formData = new FormData();
      formData.append("teamName", storedTeamName);

      const teamId = await createTeam(formData);
      localStorage.removeItem("pendingTeamName"); // Clean up
      setDialogOpen(false);
      router.push(`/dashboard/teams/${teamId}`);
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  useEffect(() => {
    if (!stripe) return;

    const params = new URLSearchParams(window.location.search);
    const clientSecret = params.get("setup_intent_client_secret");
    const sessionId = params.get("session_id");

    if (clientSecret && sessionId) {
      stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
        if (setupIntent?.status === "succeeded") {
          const formData = new FormData();
          formData.append("teamName", sessionId);

          createTeam(formData)
            .then((teamId) => {
              setDialogOpen(false);
              router.push(`/dashboard/teams/${teamId}`);
            })
            .catch((error: Error) => {
              console.error("Error creating team:", error);
            });
        }
      });
    }
  }, [stripe, router]);

  useEffect(() => {
    if (!clientSecret) return;
  }, [clientSecret]);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const response = await fetch("/api/workspaces");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWorkspaces(data);
      } catch (error) {
        console.error("Error fetching workspaces:", error);
      }
    };

    fetchWorkspaces();
  }, []);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader className="space-y-1">
          <div className="space-y-4">
            <DialogTitle className="text-3xl font-semibold tracking-tight">
              {formStage === "team" ? "Create a team" : "Set up billing"}
            </DialogTitle>
            <div className="h-px bg-gray-200 -mx-6" />
          </div>
          <DialogDescription className="text-gray-700">
            {formStage === "team"
              ? "Teams unlock collaborative features including shared model deployments, multi-user analytics, and custom API keys. Team members can deploy models, track performance, and manage resources together."
              : "Set up your subscription to get started with your team."}
          </DialogDescription>
        </DialogHeader>

        {formStage === "team" ? (
          <div className="mt-2">
            <div className="space-y-4 mb-6">
              {isLoaded &&
                userMemberships?.data &&
                userMemberships.data.map((org) => (
                  <div
                    key={org.organization.id}
                    onClick={() =>
                      router.push(`/dashboard/teams/${org.organization.id}`)
                    }
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-medium">{org.organization.name}</h3>
                      <p className="text-sm text-gray-500">
                        {org.organization.membersCount} members
                      </p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400" />
                  </div>
                ))}
            </div>

            <form ref={formRef} onSubmit={handleCreateTeam}>
              <div className="space-y-6">
                <div className="min-h-[85px]">
                  <div className="space-y-1">
                    <label
                      htmlFor="teamName"
                      className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Team Name
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      id="teamName"
                      value={teamName}
                      onChange={(e) => {
                        setTeamName(e.target.value);
                        setNameError(undefined);
                      }}
                      className={`flex h-11 w-full rounded-md border ${
                        nameError ? "border-red-500" : "border-input"
                      } bg-gray-50/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`}
                      placeholder="Enter team name"
                      required
                    />
                    <div className="h-5">
                      {nameError && (
                        <p className="text-sm text-red-500">{nameError}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between sm:space-x-2 mt-10">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-5 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
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
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col">
            <div className="flex-grow">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscriptionForm
                  onSuccess={handleSubscriptionSuccess}
                  onBack={() => setFormStage("team")}
                />
              </Elements>
            </div>
          </div>
        )}
      </DialogContent>
      <div className="min-h-screen bg-gray-50">
        <Header
          user={user}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <Tabs
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <div className="border-t border-gray-200"></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            Deployed Models
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleModels.map((model) => (
              <div
                key={model.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {model.name}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        model.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {model.status}
                    </span>
                  </div>
                  <div className="space-y-1 mb-2 text-sm">
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">Type:</span>{" "}
                      {model.type}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">
                        Version:
                      </span>{" "}
                      {model.version}
                    </p>
                    <p className="text-gray-500">
                      <span className="font-medium text-gray-700">
                        Updated:
                      </span>{" "}
                      {model.lastUpdated}
                    </p>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <BarChart2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">
                          {model.analytics.requests.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium text-gray-700">
                          {(model.analytics.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <CircularGauge
                      value={Math.round(model.analytics.accuracy * 100)}
                    />
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-150">
                    Explore model <ArrowUpRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
