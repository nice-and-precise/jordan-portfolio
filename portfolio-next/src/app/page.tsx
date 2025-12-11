import { getAllProjects } from '@/lib/data';
import { getSiteSettings } from '@/lib/settings';
import ClientHome from "@/components/ClientHome";

export default async function Home() {
  // Fetch projects and settings (Server Side)
  const projects = await getAllProjects();
  const settings = await getSiteSettings();

  return <ClientHome projects={projects} settings={settings} />;
}
