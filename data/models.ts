interface Model {
  id: string;
  name: string;
  type: string;
  status: "active" | "inactive";
  lastUpdated: string;
  version: string;
  analytics: {
    requests: number;
    accuracy: number;
  };
  trend: number[];
}

export const sampleModels: Model[] = [
  {
    id: "1",
    name: "Sentiment Analysis",
    type: "NLP",
    status: "active",
    lastUpdated: "2023-04-15",
    version: "1.2.0",
    analytics: { requests: 15234, accuracy: 0.92 },
    trend: [65, 59, 80, 81, 56, 55, 40],
  },
  {
    id: "2",
    name: "Image Classification",
    type: "Computer Vision",
    status: "active",
    lastUpdated: "2023-04-10",
    version: "2.1.0",
    analytics: { requests: 8765, accuracy: 0.89 },
    trend: [30, 40, 35, 50, 49, 60, 70],
  },
  {
    id: "3",
    name: "Fraud Detection",
    type: "Machine Learning",
    status: "inactive",
    lastUpdated: "2023-03-28",
    version: "1.0.1",
    analytics: { requests: 3210, accuracy: 0.95 },
    trend: [80, 75, 65, 60, 55, 45, 40],
  },
  {
    id: "4",
    name: "Recommendation Engine",
    type: "Machine Learning",
    status: "active",
    lastUpdated: "2023-04-12",
    version: "3.0.2",
    analytics: { requests: 21098, accuracy: 0.88 },
    trend: [40, 45, 50, 55, 60, 75, 80],
  },
];
