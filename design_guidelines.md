# Design Guidelines: eRupi Pilot Program Tracker

## Design Approach
**Utility-Focused Design System Approach** - Using Material Design principles for a productivity-focused application with enterprise-grade data management capabilities.

## Color Palette
**Primary Colors:**
- Primary: 219 91% 60% (Modern blue for trust and efficiency)
- Primary Dark Mode: 219 91% 70%

**Background & Surface:**
- Light Mode: 0 0% 98% (Clean white-gray)
- Dark Mode: 222 84% 5% (Deep charcoal)
- Surface Light: 0 0% 100%
- Surface Dark: 220 13% 18%

**Semantic Colors:**
- Success: 142 71% 45% (Task completion)
- Warning: 38 92% 50% (In progress tasks)
- Error: 0 84% 60% (Failed/blocked tasks)
- Info: 212 92% 60% (General information)

## Typography
**Font Stack:** Inter via Google Fonts CDN
- Headings: Inter 600-700 (Semibold to Bold)
- Body: Inter 400-500 (Regular to Medium)
- Code/Data: JetBrains Mono 400

**Scale:**
- H1: text-3xl (30px)
- H2: text-2xl (24px)
- H3: text-xl (20px)
- Body: text-base (16px)
- Small: text-sm (14px)

## Layout System
**Spacing Primitives:** Tailwind units 2, 4, 6, 8, 12, 16
- Micro spacing: p-2, m-2 (8px)
- Standard spacing: p-4, m-4 (16px)
- Section spacing: p-8, m-8 (32px)
- Large spacing: p-12, m-12 (48px)

## Component Library

### Core Dashboard
- **Header:** Fixed navigation with project title, user avatar, theme toggle
- **Sidebar:** Collapsible navigation with task categories, progress overview
- **Main Content:** Split-view layout (task list + chat interface)

### Task Management
- **Task Cards:** Material-style elevated cards with status indicators, progress bars
- **Status Badges:** Rounded badges with semantic colors
- **Progress Visualization:** Linear progress bars and circular completion indicators
- **Activity Timeline:** Vertical timeline with timestamps and user actions

### Chatbot Interface
- **Chat Container:** Fixed-height scrollable area with message bubbles
- **Message Styling:** Distinct user/bot message appearance with timestamps
- **Input Area:** Persistent bottom input with send button and loading states
- **Quick Actions:** Suggested action chips below chat input

### Forms & Inputs
- **Material Design:** Outlined text fields with floating labels
- **Consistent Focus States:** Blue outline rings matching primary color
- **Validation:** Inline error messages with red text and icons

### Data Display
- **Tables:** Clean borders, zebra striping, sortable headers
- **Cards:** Subtle shadows, rounded corners, proper content hierarchy
- **Metrics Dashboard:** Grid layout with key performance indicators

## Key Design Principles
1. **Information Hierarchy:** Clear visual distinction between task priorities and statuses
2. **Conversational UI:** Chat interface feels natural and integrated, not bolted-on
3. **Data Density:** Efficient use of space while maintaining readability
4. **Consistent Interaction:** Predictable patterns across all task management actions
5. **Progress Transparency:** Always visible task completion status and activity logs

## Icons
**Heroicons** via CDN for consistent line-style iconography
- Navigation icons (home, settings, chat)
- Task status icons (check, clock, alert)
- Action icons (edit, delete, add)

## No Hero Images
This is a utility-focused dashboard application without marketing elements or large hero imagery. Focus on clean, functional interface design.