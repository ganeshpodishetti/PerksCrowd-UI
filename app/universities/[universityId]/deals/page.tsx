
import { universityService } from '@/features/universities/services/universityService';
import UniversityDealsPage from '../../UniversityDealsPage';

// Required for static export (output: 'export')
export async function generateStaticParams() {
  // A build must not fail when the API is unreachable; pages render on demand.
  try {
    const universities = await universityService.getUniversities();
    return universities.map((u) => ({ universityId: u.id }));
  } catch {
    return [];
  }
}

export default function UniversityDealsRoute() {
  return <UniversityDealsPage />;
}
