import FetchPageContent from "@/components/ContentFetch";
import TaskManager from "@/components/TaskManager";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div>
        {/* <TaskManager /> */}
        <FetchPageContent />
      </div>
    </main>
  );
}
