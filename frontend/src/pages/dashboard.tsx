import { FileText } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400">
      <FileText className="w-16 h-16 opacity-20 mb-4" />
      <h2 className="text-xl font-medium">Select a note to view</h2>
      <p className="text-sm">Or create a new one from the sidebar</p>
    </div>
  );
}
