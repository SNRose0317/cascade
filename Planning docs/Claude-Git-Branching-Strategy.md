# Claude-Optimized Git Branching Strategy for Web3 Diagnostics

## 🤖 AI Execution Summary
**When Claude reads this:** You are implementing a multi-phase Git branching strategy for a Web3 diagnostics portal. This document provides complete context for autonomous development. Read sections in order: Summary → Current Branch → Dependencies → Implementation.

### Quick Navigation
- **Starting fresh?** Begin with Section 2 (Branch Structure)
- **Resuming work?** Check Section 6 (Workflow) for current branch status
- **Integration issues?** See Section 5 (AI-Specific Notes)
- **Testing/Validation?** Refer to Section 4 (Success Criteria)

### Project Context from UserJourney
- **Main Components:** Authentication, Portal, Public Site
- **Tech Stack:** React/TypeScript, Vanilla JS, CSS, No containerization
- **Customer Flow:** Landing → Auth → Profile → Evexia → Labs → Pricing → Shopify

## Branching Structure Optimized for AI Development

### 1. **Context-Rich Branch Organization**

Each branch will contain:
- `CLAUDE.md` - AI context file with everything needed for that branch
- `PRD.md` - Product requirements and acceptance criteria (temporary)
- `TASKS.md` - Checklist of implementation tasks (temporary)
- `.claude/` directory - Test data, examples, and patterns

### 2. **Simplified Branch Structure** (Optimized for Claude)

**🤖 AI Instructions:** Start with foundation branches in exact order. Each branch builds on the previous. Never skip ahead or work in parallel on foundation items.

#### **Foundation Layer** (Sequential - Must Complete in Order)
```
main
└── 01-foundation/core-setup
    ├── CLAUDE.md (Project overview, tech stack, conventions)
    ├── Focus: Environment setup, folder structure, base configurations
    ├── Files: /src/config/, /src/shared/, tsconfig.json
    └── 02-foundation/api-layer
        ├── CLAUDE.md (API patterns, error handling, service structure)
        ├── Focus: Service abstractions, error handling, API utilities
        ├── Files: /src/shared/services/, /src/portal/shared/services/
        └── 03-foundation/state-management
            ├── CLAUDE.md (State patterns, data flow)
            ├── Focus: Customer data service, auth state, localStorage
            ├── Files: CustomerDataService, auth-system.js state management
```

#### **Feature Layers** (Can be done in parallel after foundation)

**🤖 AI Instructions:** After completing ALL foundation branches, you may work on features 04-06 in any order or simultaneously. Feature 07 requires all others complete.

```
04-auth/complete-system
├── CLAUDE.md (All auth: signup, login, guards, profile)
├── Dependencies: 01, 02, 03 (all foundation complete)
├── Parallel-safe with: 05, 06
├── Customer Journey: Entry point for all authenticated features
├── Key Files: /src/auth/, auth-system.js, modal functionality
├── Success: Users can register, login, manage profile

05-evexia/integration  
├── CLAUDE.md (API key setup, validation, connection)
├── Dependencies: 01, 02, 03 (all foundation complete)
├── Parallel-safe with: 04, 06
├── Customer Journey: Connect to Evexia lab system
├── Key Files: API integration setup, validation logic
├── Success: Valid API keys stored, connection tested

06-lab/discovery-and-sync
├── CLAUDE.md (Search, filter, catalog, pricing)
├── Dependencies: 01, 02, 03 (all foundation complete)
├── Parallel-safe with: 04, 05
├── Customer Journey: Browse labs, set pricing, manage catalog
├── Key Files: Lab search, filters, pricing calculator
├── Success: Full lab discovery with pricing management

07-shopify/integration
├── CLAUDE.md (OAuth, sync, automation)
├── Dependencies: ALL previous branches (01-06)
├── Customer Journey: Final monetization step
├── Key Files: Shopify OAuth, product sync, automation
├── Success: Products sync to Shopify with correct pricing
```

### 3. **CLAUDE.md Template for Each Branch**

**🤖 AI Instructions:** Create this file FIRST when starting any branch. Update it throughout development. This is your primary context source.

```markdown
# Branch: [Branch Name]
Last Updated: [Date]
Claude Session ID: [For tracking conversations]

## 🤖 AI Quick Start
When you read this section, you should:
1. Check dependencies are merged to main
2. Run `git checkout -b [branch-name]` from main
3. Create/update this CLAUDE.md file
4. Review linked UserJourney section
5. Begin with the first unchecked task

## 🎯 Purpose
[One paragraph explaining what this branch accomplishes]

### Customer Journey Context
- **User Story**: As a [user], I want to [action] so that [outcome]
- **Journey Stage**: [Which step in the overall flow]
- **Previous Step**: [What users did before this]
- **Next Step**: [Where users go after this]

## 📋 Dependencies
- **Requires**: [List branches that must be complete]
- **Enables**: [List branches that depend on this]
- **Parallel-Safe**: [Branches that can be worked on simultaneously]

## 🗺️ File Map
Critical files for this branch:
- `/src/path/to/main/file.js` - [Purpose]
- `/src/path/to/test/file.test.js` - [Test coverage]

## 🔧 Development Context
### Current State
- [x] Component structure created
- [ ] API integration pending
- [ ] Tests written

### Patterns to Follow
```javascript
// Example from existing codebase
const pattern = {
  // Show me the established patterns
};
```

### Known Issues/Gotchas
- Issue: [Description]
  Solution: [How to handle]

## 🧪 Testing Commands
```bash
# 🤖 AI: Run these IN ORDER. All must pass before PR.

# 1. Unit tests for this feature
npm test -- --testPathPattern="auth"
# Expected: All tests pass, no failures

# 2. Linting (check code style)
npm run lint
# Expected: No errors, warnings OK if pre-existing

# 3. Type checking (if TypeScript files modified)
npm run typecheck
# Expected: No type errors

# 4. Full test suite (before PR only)
npm test
# Expected: No new failures vs main branch

# 5. Manual testing checklist
# - [ ] Feature works in browser
# - [ ] No console errors
# - [ ] Responsive on mobile
# - [ ] Error states handled
```

## 📊 Success Criteria
- [ ] All tests pass
- [ ] No console errors
- [ ] Matches UserJourney.md requirements
- [ ] Integrated with dependencies

## 🔄 Integration Points
### Incoming Data
```javascript
// What this branch receives from others
{
  customerId: "uuid",
  authToken: "jwt"
}
```

### Outgoing Data
```javascript
// What this branch provides to others
{
  userProfile: {},
  isAuthenticated: true
}
```

## 💡 Claude-Specific Notes
- Focus areas: [Where to spend most time]
- Skip areas: [What's already handled elsewhere]
- Common mistakes: [What to avoid]
```

### 4. **Additional Claude Optimization Files**

**🤖 AI Instructions:** These files are temporary scaffolding. Create at branch start, update during work, delete before PR.

#### **PRD.md** (Temporary - Delete after implementation)
```markdown
# Product Requirements: [Feature Name]

## User Story
As a [user type], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Given [context], when [action], then [result]
- [ ] Error handling for [edge cases]

## Technical Requirements
- API endpoints needed
- State management approach
- UI components required

## Test Scenarios
1. Happy path: [Description]
2. Error case: [Description]
```

#### **TASKS.md** (Temporary - Delete when done)
```markdown
# Implementation Tasks

## Current Session
- [x] Read existing code patterns
- [x] Create component structure
- [ ] Implement API calls
- [ ] Add error handling
- [ ] Write tests
- [ ] Update documentation

## Blocked By
- Waiting for API endpoint /api/xyz

## Notes for Next Session
- Remember to handle edge case where...
```

### 5. **What Claude Needs to Maximize Execution**

**🤖 AI Instructions:** Reference these resources when stuck. They contain solutions to common problems and established patterns.

#### **Code Examples Library** (`.claude/examples/`)
- Working examples of each pattern
- Copy-paste templates for common tasks

#### **Test Data Sets** (`.claude/test-data/`)
- Valid/invalid inputs
- API response mocks
- Edge cases

#### **Decision Log** (`.claude/decisions.md`)
- Why certain approaches were chosen
- Trade-offs considered

#### **Error Recovery Guide** (`.claude/recovery.md`)
- Common errors and fixes
- Rollback procedures
- Who to ask for help

#### **Integration Test Suite** (`.claude/integration-tests.md`)
- How to verify branch integrations
- Cross-branch test scenarios

#### **Performance Benchmarks** (`.claude/benchmarks.md`)
- Expected load times
- Memory usage targets
- Bundle size limits

### 6. **Branch Workflow for Claude**

**🤖 AI Instructions:** Follow this EXACT workflow for consistency. Each step has verification to prevent errors.

1. **Starting a New Branch**
   ```bash
   # 🤖 AI: ALWAYS start from main, not another feature branch
   git checkout main
   git pull origin main
   git checkout -b 01-foundation/core-setup
   
   # Verify you're on the right branch
   git branch --show-current
   # Expected output: 01-foundation/core-setup
   
   # First action: Create context files
   mkdir -p .claude
   touch CLAUDE.md PRD.md TASKS.md
   ```

2. **During Development**
   - Update TASKS.md after each work session
   - Add discoveries to CLAUDE.md
   - Document decisions in .claude/decisions.md

3. **Before PR**
   ```bash
   # 🤖 AI: Complete this checklist IN ORDER
   
   # 1. Run all tests
   npm test -- --testPathPattern="[feature]"
   npm run lint
   npm run typecheck
   
   # 2. Verify success criteria in CLAUDE.md
   # (Check each checkbox is completed)
   
   # 3. Clean up temporary files
   git rm PRD.md TASKS.md
   
   # 4. Update CLAUDE.md with final state
   # (Mark all tasks complete, add integration notes)
   
   # 5. Commit cleanup
   git add -A
   git commit -m "chore: Clean up temporary planning files"
   
   # 6. Push branch
   git push -u origin [branch-name]
   ```

4. **PR Description Template**
   ```markdown
   ## Branch: [Name]
   
   ### ✅ Completed
   - [List what was done]
   
   ### 🧪 Testing
   - [How it was tested]
   
   ### 📋 Dependencies
   - Requires: [branches]
   - Enables: [branches]
   
   ### 🔄 Integration Notes
   - [Any special integration considerations]
   ```

### 7. **Benefits of This Approach**

**🤖 AI Context:** This structure is specifically designed for your capabilities and limitations:

- **Token Efficiency**: Each branch fits in context window
- **Error Recovery**: Clear rollback paths for every action  
- **Consistency**: Templates ensure uniform quality
- **Parallelization**: Clear dependencies enable efficient work

1. **Context Preservation**: Each branch has complete context for Claude
2. **Reduced Cognitive Load**: Focused branches with clear boundaries
3. **Parallel Safety**: Clear documentation of what can be done simultaneously
4. **Quality Assurance**: Built-in testing and success criteria
5. **Efficient Handoffs**: Next Claude session can pick up immediately
6. **Self-Documenting**: The branch structure itself documents the project architecture

### 8. **Implementation Order**

**🤖 AI Execution Plan:**

1. **Phase 1: Foundation** (Sequential - 3-4 sessions)
   - 01-foundation/core-setup (1 session)
     - Environment validation
     - Base configuration
     - Shared utilities
   - 02-foundation/api-layer (1 session)  
     - Service abstractions
     - Error handling patterns
     - API client setup
   - 03-foundation/state-management (1-2 sessions)
     - Customer data service
     - Auth state management
     - LocalStorage patterns

2. **Phase 2: Core Features** (Parallel - 4-6 sessions)
   - 04-auth/complete-system (2 sessions)
     - Session 1: Signup/login flows
     - Session 2: Guards, profile, validation
   - 05-evexia/integration (1-2 sessions)
     - API key management
     - Connection validation
   - 06-lab/discovery-and-sync (2 sessions)
     - Session 1: Search and filters
     - Session 2: Pricing and catalog

3. **Phase 3: Integration** (Sequential - 2 sessions)
   - 07-shopify/integration
     - OAuth implementation
     - Sync automation

### 9. **Special Considerations for Claude**

**🤖 Self-Awareness Section:** These are your operational constraints and how this strategy addresses them.

1. **Memory Management**
   - Each branch is self-contained to work within context limits
   - CLAUDE.md provides quick context restoration
   - UserJourney references maintain big-picture awareness

2. **Error Prevention**
   - Clear dependency documentation prevents integration issues
   - Test commands in each CLAUDE.md ensure quality
   - Verification steps catch mistakes before they propagate
   - Known issues documented with solutions

3. **Efficiency**
   - Templates reduce repetitive work
   - Clear structure minimizes decision fatigue
   - Parallel work options maximize throughput
   - Pre-validated patterns prevent rework

4. **Collaboration**
   - Standardized structure makes handoffs seamless
   - Decision logs preserve reasoning for future sessions
   - Integration points clearly documented
   - Success criteria ensure consistent quality

### 10. **Quick Reference Commands**

**🤖 Copy-paste these commands as needed:**

```bash
# Check current branch and status
git branch --show-current && git status

# See what's been done
git log --oneline -10

# Check which branches are merged
git branch --merged main

# Run all quality checks
npm test && npm run lint && npm run typecheck

# See file changes in branch
git diff main...HEAD --name-only

# Emergency rollback
git reset --hard HEAD~1
```

---

*Document Version: 2.0*  
*Last Updated: [Current Date]*  
*Purpose: Complete autonomous execution guide for Claude AI development*
*Enhanced with: UserJourney integration, AI-specific instructions, verification steps*