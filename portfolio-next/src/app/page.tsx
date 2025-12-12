import { getAllProjects, getAllServices } from '@/lib/data';
import { getSiteSettings } from '@/lib/settings';
import StrategicHome from "@/components/StrategicHome";

export default async function Home() {
  // Fetch projects, settings, and services (Server Side)
  const projects = await getAllProjects();
  const settings = await getSiteSettings();
  const services = await getAllServices();

  return <StrategicHome projects={projects} settings={settings} services={services} />;
}
