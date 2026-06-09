# PR Template Base Structure

This document outlines the common structure all PR templates should follow to ensure consistency across the project.

## Overview

All pull request templates in this repository follow a standardized structure to ensure:
- Clear communication of changes
- Consistent review process
- Comprehensive testing guidelines
- Quality assurance
- Easy tracking of related issues

## Standard Sections (Included in All Templates)

Every PR template includes these core sections:

### 1. **Description**
   - Clear, concise explanation of what changes are being made
   - Why the changes are necessary
   - What problem is being solved or what feature is being added

### 2. **Type of Change**
   - Checkbox list to categorize the change:
     - Bug fix
     - New feature
     - Breaking change
     - Documentation update
     - Performance improvement
     - Refactoring

### 3. **Related Issue**
   - Link to the GitHub issue(s) this PR addresses
   - Use `Fixes #123` to auto-close issues
   - Use `Relates to #456` for related issues

### 4. **Component(s) Affected**
   - Which parts of the project are impacted
   - Examples: Frontend, Backend, Database, Documentation

### 5. **Changes Made**
   - Summary of the changes
   - List of modified files
   - Key files that were changed

### 6. **How to Test**
   - Prerequisites for testing
   - Step-by-step instructions to verify the changes
   - Expected behavior after applying the changes

### 7. **Testing & Quality**
   - Verification checklist:
     - Changes tested locally
     - Functionality verified
     - Tests pass
     - No console errors
     - Code follows conventions
     - Backward compatible

### 8. **Screenshots or Logs (if applicable)**
   - Visual evidence of changes (for UI updates)
   - Relevant error logs or output

### 9. **Additional Notes**
   - Any additional context reviewers should know
   - Design decisions or trade-offs
   - Performance considerations

### 10. **Checklist**
   - Final verification before submission:
     - PR title is descriptive
     - Description explains why
     - Related issues are linked
     - Branch is up to date
     - No merge conflicts
     - Commits are logical
     - Commit messages are clear

## Template-Specific Additions

### **default.md** (General Purpose)
- Base template with all standard sections
- Includes both Backend and Frontend subsections
- Good for mixed changes or uncertain classification

### **backend.md** (Backend Changes)
- Database Changes section
  - Schema modifications
  - Migration files
  - Data structure changes
- API Changes section
  - New/modified endpoints
  - Response format changes
  - DTOs
- SignalR Changes section
  - Hub methods
  - Message changes
  - Client interface updates
- Service Changes section
  - Logic modifications
  - Dependency updates
- Configuration section
  - Environment variables
  - Settings
- Dependencies section
  - NuGet packages
  - Versions
  - Reasons for updates

### **frontend.md** (Frontend Changes)
- Control Panel Changes section
  - Component modifications
  - Feature additions
  - UI/UX changes
- Overlay Changes section
  - Specific overlay component updates
  - Score Box, Map Screen, etc.
  - Visual changes
- Styling/CSS Changes section
  - Responsive design
  - Theme updates
  - Accessibility
- Angular-specific section
  - Component structure
  - Service changes
  - Dependency updates
- npm dependencies section

### **feature.md** (New Features)
- Focused on feature development
- Includes use case/user story
- Feature scope definition
- Acceptance criteria
- Backward compatibility notes

### **bugfix.md** (Bug Fixes)
- Root cause analysis
- Steps to reproduce the bug
- How the fix addresses the issue
- Regression testing notes
- Related tickets

### **documentation.md** (Documentation Updates)
- Documentation sections updated
- Type of documentation (README, API docs, etc.)
- Scope of changes
- Review focus areas

### **overlay.md** (Overlay Component Changes)
- Specific overlay(s) affected
- UI/UX changes
- Broadcast testing requirements
- Display verification checklist
- Affected overlays:
  - Score-Box
  - Map-Screen
  - Commentator-Box
  - Info-Box

## How to Use These Templates

1. **Choose the Right Template**
   - Determine the primary type of change
   - If mixed, use `default.md` or create PR with appropriate primary template

2. **Fill Out Completely**
   - Don't skip sections
   - Check all applicable checkboxes
   - Provide specific details, not generic answers

3. **Be Specific**
   - Link related issues with `#issue_number`
   - List actual files changed
   - Provide real test steps

4. **Include Evidence**
   - Screenshots for UI changes
   - Test output for performance changes
   - Logs for bug fixes

5. **Update Before Merging**
   - Verify all checklist items before requesting review
   - Update if changes are made during review
   - Keep information current

## Tips for Quality PRs

✅ **Do:**
- Use descriptive branch names: `feature/add-timer`, `bugfix/signalr-crash`
- Write clear commit messages following conventions
- Keep PRs focused on a single concern
- Include test steps even if they seem obvious
- Link all related issues
- Respond promptly to review comments

❌ **Don't:**
- Leave template sections empty
- Make unrelated changes in one PR
- Merge without filling out the template
- Forget to link related issues
- Skip testing instructions
- Leave out breaking changes documentation

## Questions?

If you're unsure which template to use:
1. Check the CONTRIBUTING.md file
2. Look at recent merged PRs for examples
3. Ask in the issue or discussions before creating the PR

---

**Last Updated:** 2026-06-09
