# CLAUDE.md - [Branch Name]
Version: 1.0
Last Updated: [Date]
Branch: [branch-name]
Previous Session: [Session ID or Date]
Next Session Planning: [What to tackle next]

## 🤖 CRITICAL: Read This First
**STOP** - Before doing ANYTHING:
1. Verify you're on the correct branch: `git branch --show-current`
2. Check if dependencies are merged: `git branch --merged main | grep -E "(list dependencies)"`
3. Read the **Current State** section to understand what's already done
4. If anything is unclear, ASK FOR CLARIFICATION before proceeding

## 🎯 Branch Mission Statement
**In one sentence:** [What this branch accomplishes]
**Success looks like:** [Concrete deliverable description]
**Failure looks like:** [Common mistakes to avoid]

## 🧠 Essential Context You Need

### What You're Building
[2-3 paragraphs explaining the feature/component in detail, including:
- The specific problem this solves
- How users will interact with it
- Technical approach and architecture decisions]

### Your Boundaries
**You ARE responsible for:**
- [Specific file/component 1]
- [Specific file/component 2]
- [Integration point 1]

**You are NOT responsible for:**
- [What other branches handle]
- [Out of scope items]
- [Future enhancements]

### Customer Journey Context
```
Previous Step: [What users just did] → 
YOUR STEP: [What happens in this branch] → 
Next Step: [Where users go next]
```

## 📊 Current State & Progress

### Already Completed
- [x] [Specific task with file reference]
- [x] [Another completed task]
- [ ] [Pending task]

### Active Work Item
**Currently Working On:** [Specific task]
**Files Being Modified:** [List files]
**Blocker/Issue:** [Any current problems]

### Session History
```
Session 1 (Date): Created component structure, added basic routing
Session 2 (Date): Implemented API calls, discovered issue with...
Session 3 (Date): [What happened]
```

## 🔗 Dependencies & Integration Points

### Incoming Dependencies (What I Need)
```javascript
// From 01-foundation/core-setup
import { sharedUtils } from '@/shared/utils';
// Expected shape: { formatDate(), validateEmail(), ... }

// From 02-foundation/api-layer  
import { apiClient } from '@/services/api';
// Expected methods: .get(), .post(), .handleError()

// From 03-foundation/state-management
import { customerDataService } from '@/services/customer';
// Expected interface: { getCustomer(), updateCustomer(), ... }
```

### Outgoing Contracts (What I Provide)
```javascript
// This branch exports:
export const [featureName] = {
  // Method signatures other branches depend on
  authenticate: (credentials) => Promise<User>,
  isAuthenticated: () => boolean,
  // ... etc
};
```

### Integration Checklist
- [ ] Verified incoming dependencies exist and match expected interface
- [ ] Tested integration with [dependent feature]
- [ ] Updated integration tests
- [ ] Documented any API changes

## 📁 File Map & Code Patterns

### Critical Files for This Branch
```
src/
├── [main-feature-directory]/
│   ├── components/
│   │   ├── [Component1].tsx      # Main UI component
│   │   └── [Component2].tsx      # Supporting component
│   ├── services/
│   │   └── [service].ts          # Business logic
│   ├── hooks/
│   │   └── use[Feature].ts       # Custom React hooks
│   └── types/
│       └── [feature].types.ts    # TypeScript definitions
├── shared/
│   └── [any shared updates]
└── tests/
    └── [feature].test.ts         # Test files
```

### Code Patterns to Follow
```typescript
// PATTERN 1: Error Handling (from existing codebase)
try {
  const result = await apiCall();
  // Always check for specific error types
  if (result.error) {
    throw new CustomError(result.error.message);
  }
} catch (error) {
  // Use centralized error handler
  handleError(error, { context: 'FeatureName' });
}

// PATTERN 2: State Management
// [Show actual pattern from the codebase]

// PATTERN 3: Component Structure  
// [Show actual pattern from the codebase]
```

### Naming Conventions
- Components: `PascalCase` (e.g., `UserProfile`)
- Hooks: `camelCase` with `use` prefix (e.g., `useAuthentication`)
- Services: `camelCase` with `Service` suffix (e.g., `authService`)
- Types: `PascalCase` with context (e.g., `UserAuthResponse`)

## 🧪 Testing Strategy

### Test Coverage Requirements
- [ ] Unit tests for all service methods
- [ ] Component tests for user interactions
- [ ] Integration tests for API calls
- [ ] Error scenario coverage

### Test Commands
```bash
# Run tests for this feature only
npm test -- --testPathPattern="[feature-name]"

# Run with coverage
npm test -- --coverage --testPathPattern="[feature-name]"

# Run in watch mode during development
npm test -- --watch --testPathPattern="[feature-name]"
```

### Critical Test Scenarios
1. **Happy Path**: [Description of main success flow]
2. **Error Case 1**: [What happens when X fails]
3. **Error Case 2**: [What happens when Y fails]
4. **Edge Case**: [Boundary condition to test]

## 🚨 Known Issues & Gotchas

### Current Blockers
- **Issue**: [Description]
  - **Impact**: [What this blocks]
  - **Workaround**: [Temporary solution if any]
  - **Needs**: [What would fix this]

### Common Pitfalls
1. **Don't**: [Common mistake]
   **Do**: [Correct approach]
   
2. **Don't**: [Another mistake]
   **Do**: [Correct approach]

### Technical Debt
- [ ] [Item that needs refactoring]
- [ ] [Performance optimization needed]
- [ ] [Code cleanup required]

## 🔄 Integration Testing

### Pre-Integration Checklist
- [ ] All unit tests pass
- [ ] No TypeScript errors
- [ ] Linting passes
- [ ] Manual testing completed
- [ ] Dependencies verified

### Integration Test Plan
```bash
# 1. Checkout this branch and dependencies
git checkout [branch-name]

# 2. Merge dependencies locally for testing
git merge origin/01-foundation/core-setup
git merge origin/02-foundation/api-layer
# ... etc

# 3. Run integration tests
npm test:integration

# 4. Manual integration testing steps
# - Step 1: [Specific user action]
# - Step 2: [Expected result]
# - Step 3: [Verify integration point]
```

## 📈 Performance Considerations

### Bundle Size Impact
- Current feature size: ~[X]KB
- Acceptable limit: [Y]KB
- Optimization opportunities: [List any]

### Runtime Performance
- API calls should complete in < [X]ms
- UI should render in < [Y]ms
- Memory usage should stay under [Z]MB

## 🔐 Security Checklist
- [ ] No hardcoded secrets or API keys
- [ ] Input validation on all user inputs
- [ ] XSS prevention in place
- [ ] CSRF tokens used where needed
- [ ] Sensitive data encrypted in localStorage
- [ ] API calls use proper authentication

## 📝 Decisions & Rationale

### Key Decisions Made
1. **Decision**: Chose [approach A] over [approach B]
   - **Why**: [Reasoning]
   - **Trade-offs**: [What we gave up]
   - **Benefits**: [What we gained]

2. **Decision**: [Another decision]
   - **Why**: [Reasoning]
   - **Trade-offs**: [Considerations]

### Open Questions
- [ ] Should we [question about approach]?
- [ ] How should we handle [edge case]?
- [ ] Is [assumption] correct?

## 🚀 Ready for PR Checklist

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] Code coverage > 80%

### Documentation
- [ ] CLAUDE.md updated with final state
- [ ] Code comments added where needed
- [ ] API changes documented
- [ ] README updated if needed

### Manual Testing
- [ ] Feature works in development
- [ ] Feature works in production build
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] Accessibility checked

### Cleanup
- [ ] Remove console.logs
- [ ] Remove commented code
- [ ] Remove TODO comments (or create issues)
- [ ] Delete PRD.md and TASKS.md

## 🔮 Future Considerations

### Next Steps After This Branch
1. [What should be built next]
2. [Optimization opportunities]
3. [Refactoring possibilities]

### Potential Enhancements
- [Enhancement 1 - not in scope now]
- [Enhancement 2 - for future iteration]

## 📚 Resources & References

### External Documentation
- [Link to API docs]
- [Link to design specs]
- [Link to user stories]

### Related Files in Other Repos
- [Path to similar implementation]: [What to learn from it]
- [Path to reusable component]: [How to adapt it]

### Code to Potentially Reuse
```javascript
// From [other repo/file]
// This pattern could be adapted for our use:
[code snippet]
```

## 🆘 When You're Stuck

### Who to Ask
- **Technical questions**: Ask user about [specific area]
- **Business logic**: Refer to [document]
- **Design decisions**: Check [design file]

### Common Issues & Solutions
1. **Problem**: Can't find [something]
   **Solution**: It's located in [place]

2. **Problem**: [Common error]
   **Solution**: [How to fix]

### Emergency Rollback
```bash
# If something goes wrong:
git stash  # Save your work
git checkout main
git branch -D [branch-name]  # Delete local branch
git checkout -b [branch-name]  # Start fresh
```

---

## 🤖 AI Session Notes
[This section is for you to update after each session]

### Session Start Checklist
- [ ] Read entire CLAUDE.md
- [ ] Verify on correct branch
- [ ] Check current test status
- [ ] Review last session's notes

### Session End Checklist  
- [ ] Update "Current State" section
- [ ] Document any decisions made
- [ ] List blockers discovered
- [ ] Plan next session's work
- [ ] Commit work with clear message

### Inter-Session Communication
**For Next Session**: [What the next AI should know]
**Discovered Issues**: [Problems to solve next time]
**Time Estimate**: [How long remaining work might take]