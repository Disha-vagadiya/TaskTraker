# TaskTraker - Productivity Dashboard

TaskTraker is a modern, responsive task management application built with React, TypeScript, and Tailwind CSS. It helps users organize their daily tasks with features like filtering, sorting, and real-time dashboard statistics.

## 🚀 Setup Instructions

### Installation Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd TaskTraker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Currently, the application uses mock services and does not require specific environment variables. For future backend integration, create a `.env` file in the root:
```env
VITE_API_URL=https://api.yourbackend.com
```

### Run Commands
- **Start development server**:
  ```bash
  npm run dev
  ```
- **Build for production**:
  ```bash
  npm run build
  ```
- **Preview production build**:
  ```bash
  npm run preview
  ```

## 🏗️ Architecture Notes

### Folder Structure
- `src/components/layout`: Core layout components (Sidebar, Navbar, PageLayout).
- `src/components/ui`: Reusable UI components (Button, Input, Modal).
- `src/context`: State management using React Context API (`AuthContext`, `TaskContext`).
- `src/pages`: Application pages (Dashboard, Tasks list, Auth flows).
- `src/services`: API abstraction layer (currently using LocalStorage for mock persistence).
- `src/types`: Centralized TypeScript interfaces and types.

### State Management Decisions
I chose the **React Context API** for state management to avoid the complexity of Redux while maintaining a clean, centralized way to handle global state like user authentication and task data. It provides a lightweight solution that fits the scope of this application perfectly.

### Design Choices
- **Tailwind CSS (v4)**: Used for rapid UI development and maintaining a consistent design system without writing custom CSS files.
- **Responsive Layout**: Implemented a "Mobile First" approach. On mobile, the sidebar collapses into a drawer accessed via a hamburger menu.
- **Manual Search**: Replaced real-time filtering with a manual "Search" button to give users more control over when results are updated and to reduce unnecessary re-renders.
- **Lucide React**: Used for clean and consistent iconography across the dashboard.

### Tradeoffs Made
- **Mock Services**: Used `localStorage` instead of a real database to make the application immediately runnable and portable without backend setup.
- **Context vs. State Libraries**: Opted for Context API over Redux/Zustand to keep dependencies minimal, though a larger app might benefit from more robust state libraries.

### Assumptions
- The application is primarily used in modern web browsers.
- Persistent data is stored locally in the browser, so it will be lost if the browser cache is cleared.

## 🌟 Future Improvements
- **Real Backend Integration**: Replace mock services with a Node.js/Express or Firebase backend.
- **Testing**: Add unit tests with Vitest and E2E tests with Playwright or Cypress.
- **Task Categorization**: Add support for custom "Projects" or "Labels" to group tasks.
- **Advanced Filters**: Implement date range filtering and multi-select for priorities.
- **Drag & Drop**: Implement task reordering or a Kanban board view.
- **Notifications**: Add browser notifications for upcoming task deadlines.