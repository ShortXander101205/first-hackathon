import { getCatalogEntryByTitle, isWhitelistedMajor } from '@/data/careerCatalog';
import { GuideResult } from '@/types/career';

/**
 * Validates synthesized AI results against the curated 48-profession catalog whitelist,
 * checking 2 Top Match + 2 Explore Also, whitelist role titles, whitelist majors,
 * 2 primary + 2 adjacent field spread, and 3-stage milestones.
 */
export function validateGuideSynthesisResult(result: any): boolean {
  if (!result || typeof result !== 'object') return false;
  const cards = result.pathways || result.careers;
  if (!Array.isArray(cards) || cards.length !== 4) return false;

  const topMatches = cards.filter((c: any) => c.badge === 'Top Match');
  const exploreAlso = cards.filter((c: any) => c.badge === 'Explore Also');
  if (topMatches.length !== 2 || exploreAlso.length !== 2) return false;

  // 1. Verify every card has a whitelisted title and map its catalog entry
  const topEntries = topMatches.map((c: any) => {
    const title = c.roleTitle || c.role_title;
    return getCatalogEntryByTitle(title);
  });
  const exploreEntries = exploreAlso.map((c: any) => {
    const title = c.roleTitle || c.role_title;
    return getCatalogEntryByTitle(title);
  });

  if (topEntries.some((entry) => !entry) || exploreEntries.some((entry) => !entry)) {
    return false;
  }

  // 2. Verify all recommended majors on all cards are whitelisted
  for (const card of cards) {
    if (!Array.isArray(card.majors) || card.majors.length === 0) return false;
    for (const major of card.majors) {
      if (!isWhitelistedMajor(major)) return false;
    }
    // 3. Verify 3-stage milestones are populated
    if (
      !card.milestones ||
      typeof card.milestones.education !== 'string' ||
      !card.milestones.education.trim() ||
      typeof card.milestones.entryRole !== 'string' ||
      !card.milestones.entryRole.trim() ||
      typeof card.milestones.growthRole !== 'string' ||
      !card.milestones.growthRole.trim()
    ) {
      return false;
    }
  }

  // 4. Verify 2 Top Match cards share the same primary field
  const primaryField = topEntries[0]!.field;
  if (topEntries[1]!.field !== primaryField) return false;

  // 5. Verify 2 Explore Also cards come from adjacent fields (not matching primary field)
  if (exploreEntries.some((entry) => entry!.field === primaryField)) {
    return false;
  }

  return true;
}
