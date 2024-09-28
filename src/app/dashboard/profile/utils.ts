import { Education } from '@/db/schema';
import { DegreeType, degreeOrder } from './types';

export const createSortedEducations = (educations: Education[]) =>
  educations.sort(
    (a, b) =>
      degreeOrder[a.degree as DegreeType] - degreeOrder[b.degree as DegreeType]
  );
