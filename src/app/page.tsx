import FetchPageContent from "@/components/ContentFetch";
import TaskManager from "@/components/TaskManager";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div>
        <TaskManager />
        <FetchPageContent />
      </div>
    </main>
  );
}
