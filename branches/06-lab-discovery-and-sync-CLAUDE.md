# CLAUDE.md - Lab Discovery and Sync
Version: 1.0
Last Updated: December 6, 2024
Branch: 06-lab/discovery-and-sync
Previous Session: Initial Creation
Next Session Planning: Implement lab catalog browser

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep -E "(01-foundation|02-foundation|03-foundation)"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** Build a searchable lab catalog with filtering, pricing transparency, and detailed test information.
**Success looks like:** Clinicians can efficiently find, compare, and understand lab tests with clear pricing and descriptions.
**Failure looks like:** Overwhelming test lists, unclear pricing, or inability to find specific tests.

## 🧠 Essential Context You Need

### What You're Building
This branch implements the lab test discovery system that allows clinicians to browse, search, and filter through Evexia's lab catalog. The system provides a user-friendly interface for exploring available tests with real-time search, multi-faceted filtering (by category, price range, turnaround time), and detailed test information display.

The catalog integrates with the Evexia API (connection established in branch 05) to fetch and display current test offerings, pricing, and availability. A key feature is the pricing calculator that helps clinicians understand costs and compare options. The implementation focuses on performance with efficient data loading, caching, and responsive UI updates.

### Your Boundaries
**You ARE responsible for:**
- Lab catalog browser interface
- Search functionality with autocomplete
- Multi-faceted filtering system
- Test detail views with comprehensive info
- Pricing calculator and comparisons
- Results pagination and sorting
- Catalog data caching strategy

**You are NOT responsible for:**
- Evexia API connection (handled by branch 05)
- Order placement (handled by branch 07)
- Authentication (handled by branch 04)
- Base UI components (from foundation)
- Payment processing (future scope)

### Customer Journey Context
```
Previous Step: User connects Evexia account (branch 05) → 
YOUR STEP: User searches labs → Filters results → Views details → Compares pricing → 
Next Step: User creates orders (branch 07)
```

## 📊 Current State & Progress

### Already Completed
- [x] Basic directory structure planned
- [ ] Lab catalog component structure
- [ ] Search implementation
- [ ] Filter system
- [ ] Test detail modal
- [ ] Pricing calculator
- [ ] Results pagination

### Active Work Item
**Currently Working On:** Initial planning
**Files Being Modified:** None yet
**Blocker/Issue:** None currently

### Session History
```
Session 1 (Dec 6, 2024): Created CLAUDE.md, planning lab discovery features
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 01-foundation/core-setup
import { Input, Button, Card, Modal } from '@/shared/components/ui';
import { useDebounce } from '@/shared/hooks';
// Expected: UI components and utility hooks

// From 02-foundation/api-layer  
import { apiClient } from '@/shared/services/api';
// Expected: .get('/labs/catalog'), .get('/labs/search')

// From 03-foundation/state-management
import { customerDataService } from '@/portal/shared/services/CustomerDataService';
// Expected: Customer preferences and saved searches

// From 05-evexia/integration
import { evexiaIntegration } from '@/portal/evexia/services/evexiaService';
// Expected: isConnected(), for access control
```

### Outgoing Contracts (What I Provide)
```javascript
// This branch exports:
export const labCatalog = {
  // Search and browse
  searchTests: (query, filters) => Promise<SearchResults>,
  getTestDetails: (testId) => Promise<TestDetails>,
  getCategories: () => Promise<Category[]>,
  
  // Filtering
  applyFilters: (filters) => Promise<FilteredResults>,
  clearFilters: () => void,
  
  // Pricing
  calculatePrice: (testIds, quantity) => Promise<PriceBreakdown>,
  comparePrices: (testIds) => Promise<PriceComparison>,
  
  // User preferences
  saveSearch: (searchCriteria) => Promise<void>,
  getSavedSearches: () => Promise<SavedSearch[]>,
  
  // Data management
  refreshCatalog: () => Promise<void>,
  getCatalogLastUpdated: () => Date
};

// Types
interface SearchResults {
  tests: Test[];
  totalCount: number;
  facets: FilterFacets;
}

interface Test {
  id: string;
  name: string;
  category: string;
  price: number;
  turnaroundTime: string;
  description: string;
}
```

### Integration Checklist
- [ ] Evexia connection check before access
- [ ] API pagination handling implemented
- [ ] Search debouncing configured
- [ ] Filter state management working
- [ ] Price calculations accurate

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── portal/
│   ├── labs/
│   │   ├── components/
│   │   │   ├── LabCatalog.js         # Main catalog container
│   │   │   ├── LabSearch.js          # Search bar with autocomplete
│   │   │   ├── LabFilters.js         # Filter sidebar
│   │   │   ├── LabGrid.js            # Results grid/list view
│   │   │   ├── LabCard.js            # Individual test card
│   │   │   ├── LabDetail.js          # Detailed test modal
│   │   │   └── PriceCalculator.js    # Pricing tool
│   │   ├── services/
│   │   │   ├── labService.js         # API calls and data
│   │   │   ├── labSearch.js          # Search algorithms
│   │   │   └── labCache.js           # Caching strategy
│   │   ├── hooks/
│   │   │   ├── useLabSearch.js       # Search state hook
│   │   │   └── useLabFilters.js      # Filter state hook
│   │   └── styles/
│   │       ├── lab-catalog.css       # Catalog styles
│   │       └── lab-filters.css       # Filter styles
```

### Code Patterns to Follow
```javascript
// PATTERN 1: Efficient Search with Debouncing
function useLabSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  const searchResults = useQuery(
    ['labSearch', debouncedQuery],
    () => labService.searchTests(debouncedQuery),
    { enabled: debouncedQuery.length > 2 }
  );
  
  return { query, setQuery, results: searchResults.data };
}

// PATTERN 2: Multi-faceted Filtering
const filterSchema = {
  categories: [],      // Multi-select
  priceRange: {       // Range slider
    min: 0,
    max: 1000
  },
  turnaroundTime: [], // Checkboxes
  availability: true  // Toggle
};

function applyFilters(tests, filters) {
  return tests.filter(test => {
    const matchesCategory = !filters.categories.length || 
      filters.categories.includes(test.category);
    const matchesPrice = test.price >= filters.priceRange.min && 
      test.price <= filters.priceRange.max;
    // ... other filter logic
    return matchesCategory && matchesPrice;
  });
}

// PATTERN 3: Catalog Caching
const catalogCache = {
  data: null,
  timestamp: null,
  TTL: 30 * 60 * 1000, // 30 minutes
  
  isValid() {
    return this.data && 
      (Date.now() - this.timestamp) < this.TTL;
  },
  
  async get() {
    if (!this.isValid()) {
      await this.refresh();
    }
    return this.data;
  }
};
```

### Naming Conventions
- Components: `Lab` prefix for all lab-related (e.g., `LabSearch`)
- Services: Descriptive purpose (e.g., `labService`, `labCache`)
- Hooks: Standard `use` prefix (e.g., `useLabFilters`)
- CSS classes: BEM style `.lab-catalog__filter-item`

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] Search functionality with edge cases
- [ ] Filter combinations and edge cases
- [ ] Pagination and infinite scroll
- [ ] Price calculations accuracy
- [ ] Performance with large datasets

### Test Commands
```bash
# Run tests for lab features only
npm test -- --testPathPattern="lab"

# Run performance tests
npm test:performance -- --testPathPattern="lab"

# Test with large dataset
npm test -- --testPathPattern="lab" --env=large-dataset
```

### Critical Test Scenarios
1. **Search Flow**: Type query → See autocomplete → Select result → View details
2. **Filter Combinations**: Apply multiple filters → Verify results → Clear filters
3. **Price Calculator**: Select multiple tests → See breakdown → Compare options
4. **Performance**: Load 1000+ tests → Search/filter remains responsive
5. **Empty States**: No results → Clear messaging → Suggestions provided

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: Lab catalog API structure unknown
  - **Impact**: Can't implement exact data model
  - **Workaround**: Create flexible adapter pattern
  - **Needs**: API documentation from Evexia

### Common Pitfalls
1. **Don't**: Load entire catalog at once
   **Do**: Implement pagination or virtual scrolling
   
2. **Don't**: Search on every keystroke
   **Do**: Debounce search input (300ms)

3. **Don't**: Apply filters on client with large datasets
   **Do**: Send filters to API when possible

### Technical Debt
- [ ] Implement virtual scrolling for large results
- [ ] Add search result highlighting
- [ ] Create advanced search options

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] Evexia connection verified
- [ ] Search returns relevant results
- [ ] Filters work independently and together
- [ ] Pricing calculations match Evexia
- [ ] Performance acceptable with real data

### Integration Test Plan
```bash
# 1. Setup branch with dependencies
git checkout 06-lab/discovery-and-sync
git merge origin/01-foundation/core-setup
git merge origin/02-foundation/api-layer
git merge origin/03-foundation/state-management

# 2. Run integration suite
npm test:integration -- --testPathPattern="lab"

# 3. Manual testing checklist
# - Connect Evexia account first
# - Search for "vitamin" - verify autocomplete
# - Filter by price < $100
# - Add category filter "Hormones"
# - Open test details modal
# - Use price calculator with 3 tests
# - Test pagination/infinite scroll
```

## 📈 Performance Considerations

### Bundle Size Impact
- Current feature size: ~60KB
- Acceptable limit: 80KB
- Optimization: Lazy load detail modals

### Runtime Performance
- Search autocomplete: < 100ms response
- Filter application: < 50ms
- Initial catalog load: < 2s
- Pagination: < 500ms per page

### Optimization Strategies
- Implement virtual scrolling for > 100 items
- Cache catalog data for 30 minutes
- Debounce all user inputs
- Lazy load test detail information

## 🔐 Security Checklist
- [ ] No sensitive pricing data in localStorage
- [ ] API calls use proper authentication
- [ ] No patient data exposed in searches
- [ ] Rate limiting on search API
- [ ] Sanitize search inputs

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Client-side filtering for better UX
   - **Why**: Instant feedback, reduced API calls
   - **Trade-offs**: Higher memory usage
   - **Benefits**: Responsive interface, offline capability

2. **Decision**: Virtual scrolling for large results
   - **Why**: Performance with 1000+ tests
   - **Trade-offs**: More complex implementation
   - **Benefits**: Smooth scrolling, low memory

### Open Questions
- [ ] Should we cache searches or just catalog?
- [ ] How to handle test availability changes?
- [ ] Do we need saved filter presets?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All tests pass
- [ ] Performance benchmarks met
- [ ] Accessibility audit passed
- [ ] Code coverage > 80%

### Documentation
- [ ] CLAUDE.md updated
- [ ] API integration documented
- [ ] Search algorithm documented
- [ ] Performance notes added

### Manual Testing
- [ ] Search works with various queries
- [ ] All filter combinations tested
- [ ] Price calculator accurate
- [ ] Mobile responsive
- [ ] Keyboard navigation works

### Cleanup
- [ ] Remove console.logs
- [ ] Optimize bundle size
- [ ] Remove test data
- [ ] Performance profiling done

## 🔮 Future Considerations

### Next Steps After This Branch
1. Order creation uses selected tests
2. Shopify sync includes test catalog
3. Automated reorder suggestions

### Potential Enhancements
- AI-powered test recommendations
- Test bundling suggestions
- Price history tracking
- Favorite tests list

## 📚 Resources & References

### External Documentation
- [Evexia Lab Catalog API](https://evexia.com/api/labs)
- [Virtual Scrolling Guide](https://web.dev/virtualize-lists/)
- [Search UX Best Practices](https://www.nngroup.com/articles/search-interface/)

### Related Files in Other Repos
- Search implementation: [Reference search component]
- Filter patterns: [E-commerce filter example]

### Code to Potentially Reuse
```javascript
// Debounce hook from shared utilities
import { useDebounce } from '@/shared/hooks/useDebounce';

// Price formatting from shared utils
import { formatCurrency } from '@/shared/utils/format';
```

## 🆘 When You're Stuck

### Who to Ask
- **Lab catalog structure**: Check with Evexia team
- **Search algorithms**: Review similar implementations
- **Performance issues**: Profile and optimize

### Common Issues & Solutions
1. **Problem**: Search too slow with large catalog
   **Solution**: Implement search indexing

2. **Problem**: Filters cause layout shift
   **Solution**: Reserve space for filter counts

3. **Problem**: Price calculations don't match
   **Solution**: Verify pricing rules with Evexia

### Emergency Rollback
```bash
# If something goes wrong:
git stash
git checkout main
git branch -D 06-lab/discovery-and-sync
git checkout -b 06-lab/discovery-and-sync
```

---

## 🤖 AI Session Notes

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Verify on correct branch
- [ ] Check Evexia connection active
- [ ] Review existing lab components

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document API findings
- [ ] Note performance metrics
- [ ] Plan next session's work
- [ ] Commit with clear message

### Inter-Session Communication
**For Next Session**: Start with basic catalog display
**Discovered Issues**: Need real API response examples
**Time Estimate**: 4-5 sessions for full implementation