import { getAllProjects } from '@/lib/data';
import ClientHome from "@/components/ClientHome";

export default async function Home() {
  // Fetch projects for the Selected Engagements section (Server Side)
  const projects = await getAllProjects();

  return <ClientHome projects={projects} />;
}
