"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

import { Header } from "@/components/dashboard/header";
import { Tabs } from "@/components/dashboard/tabs";

export default function TeamPage({}: { params: { teamId: string } }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user } = useUser();

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
        <div className="flex-grow">
          <div className="max-w-7xl w-full mx-auto px-4 py-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">
              Team Models
            </h2>

            {/* Empty state */}
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center w-full">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <PlusCircle className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No models deployed
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Get started by deploying your first model to your team
                  workspace.
                </p>
                <button className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800">
                  Deploy Model
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
