# Fix: Move FilterSection outside CategoryContent component

## Problem
The `<input>` in `FilterSection` loses focus after each keystroke because `FilterSection` is defined inside `CategoryContent`, causing React to recreate it on every state change.

## Solution
Move `FilterSection` outside as a separate component and pass props.

## Implementation Steps

### Step 1: Add FilterSectionProps interface before CategoryContent (line 27)
```typescript
interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  priceRange: string;
  setPriceRange: (value: string) => void;
  stockOnly: boolean;
  setStockOnly: (value: boolean) => void;
  priceRanges: { value: string; label: string }[];
  currentSlug: string;
  categories: any[];
  setActiveSort: (value: string) => void;
}
```

### Step 2: Convert FilterSection to standalone component (lines 77-140)
Replace the inline `const FilterSection = () => (...)` with:
```typescript
function FilterSection({ ...props }: FilterSectionProps) {
  // ... same content but using props.searchQuery, props.setSearchQuery, etc.
}
```

### Step 3: Update FilterSection usage in JSX (lines 163 and 171)
Pass props to both FilterSection instances:
```jsx
<FilterSection 
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  priceRange={priceRange}
  setPriceRange={setPriceRange}
  stockOnly={stockOnly}
  setStockOnly={setStockOnly}
  priceRanges={priceRanges}
  currentSlug={currentSlug}
  categories={categories}
  setActiveSort={setActiveSort}
/>
```

## Status: NEEDS IMPLEMENTATION
The plan file was created but edit permissions are blocked. User needs to enable edits to proceed.