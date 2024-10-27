"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

import { useUser } from "@clerk/nextjs";
import Intercom from "@intercom/messenger-js-sdk";
import { ArrowUpRight, BarChart2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircularGauge } from "@/components/ui/gauge";
import { Footer } from "@/components/marketing/footer";
import { createTeam } from "@/app/actions/create-team";
import { sampleModels } from "@/data/models";
import { Header } from "@/components/dashboard/header";
import { Tabs } from "@/components/dashboard/tabs";

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();
  const [teamName, setTeamName] = useState("");
  const [teamSlug, setTeamSlug] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      try {
        const id = await createTeam(formData);
        setDialogOpen(false);
        router.push(`/dashboard/teams/${id}`);
      } catch (error) {
        console.error("Error creating team:", error);
      }
    }
  };

  Intercom({
    app_id: "kr3tjdn6",
    user_id: user?.id ?? undefined,
    name: user?.firstName ?? undefined,
    email: user?.primaryEmailAddress?.emailAddress ?? undefined,
    created_at: user?.createdAt
      ? Math.floor(user.createdAt.getTime() / 1000)
      : undefined,
  });

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>
          <DialogDescription>
            Create a new team to collaborate with others.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-gray-700"
            >
              Team Name
            </label>
            <input
              type="text"
              name="teamName"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="teamSlug"
              className="block text-sm font-medium text-gray-700"
            >
              Team Slug
            </label>
            <input
              type="text"
              name="teamSlug"
              id="teamSlug"
              value={teamSlug}
              onChange={(e) => setTeamSlug(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Team
            </button>
          </div>
        </form>
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
      <Footer />
    </Dialog>
  );
}
