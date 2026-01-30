# Fertility Alignment Update Instructions

This PR introduces critical fertility supplements and mapping logic.

## ⚠️ Action Required

The file \`src/data/supplements.ts\` needs to be updated to include the new supplements.
Since the file is large, we have created \`src/data/fertilitySupplements.ts\` containing the new data.

**Please perform the following update in \`src/data/supplements.ts\`:**

1.  **Import** the new supplements (or copy them directly):
    \`\`\`typescript
    import { fertilitySupplements } from './fertilitySupplements';
    \`\`\`

2.  **Spread** them into the main \`supplements\` array:
    \`\`\`typescript
    export const supplements: Supplement[] = [
      ...existingSupplements,
      ...fertilitySupplements
    ];
    \`\`\`
    
    *Alternatively, copy the content from \`src/data/fertilitySupplements.ts\` and paste it at the end of the \`supplements\` array in \`src/data/supplements.ts\`.*

3.  **Update Goals** for existing supplements:
    *   **Ashwagandha**: Add \`'fertility', 'male-reproductive', 'sperm-quality', 'sperm-count', 'sperm-motility'\` to \`goals\`.
    *   **Mucuna pruriens**: Add \`'male-reproductive', 'sperm-quality', 'sexual-performance'\` to \`goals\`.
    *   **Shatavari**: Add \`'female-reproductive', 'ovulation', 'cervical-mucus'\` to \`goals\`.

## What's Included
*   \`src/data/fertilitySupplements.ts\`: 6 new fertility supplements (Vitex, Tribulus, etc.).
*   \`src/data/stack-supplement-mappings.ts\`: New mapping logic for fertility stacks.
*   \`src/utils/searchSupplements.ts\`: Improved search utility with gender filtering.
