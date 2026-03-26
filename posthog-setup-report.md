# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Vue 3 + Vite project. The project already had partial analytics instrumentation (Matomo, GA4, Volcano Engine, Umami) — PostHog has been added alongside these without replacing them.

Key changes made:

- **`src/main.js`**: Initialized `posthog-js` using `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` environment variables. Added `posthog.identify()` using the app's existing persistent user ID (`globalUserId` from `src/util/tracking.js`). Added a global Vue error handler that sends uncaught exceptions to PostHog via `posthog.captureException()`.
- **`src/router/index.js`**: Added PostHog SPA pageview tracking in `router.afterEach`, replacing an unsafe `window.posthog` guard with a direct SDK import and `posthog.capture('$pageview', ...)`.
- **`src/components/ProjectWorkbench.vue`**: Added PostHog import and `posthog.capture()` calls for navigation and task entry events.
- **`src/components/PageB.vue`**: Added PostHog import, `task_select` event on task selection, and corrected navigation events (replacing incorrect `window.posthog` guards that had wrong event names).
- **`src/components/PageC.vue`**: Added PostHog import, `task_complete` event on task confirmation, and corrected navigation events (replacing incorrect `window.posthog` guards that had wrong event names).
- **`.env`**: Created with `VITE_POSTHOG_PROJECT_TOKEN` and `VITE_POSTHOG_HOST` values.

| Event | Description | File |
|---|---|---|
| `$pageview` | Fired on every SPA route change | `src/router/index.js` |
| `navigate_click` | User clicks a navigation button between pages | `src/components/ProjectWorkbench.vue`, `src/components/PageB.vue`, `src/components/PageC.vue` |
| `project_task_enter` | User clicks to enter a project task from the workbench | `src/components/ProjectWorkbench.vue` |
| `dynamic_workflow_enter_task` | User clicks to enter a dynamic workflow task from the workbench | `src/components/ProjectWorkbench.vue` |
| `project_view_add_click` | User clicks to add a new view in the project workbench | `src/components/ProjectWorkbench.vue` |
| `project_view_task_add` | User clicks to add a task within a view | `src/components/ProjectWorkbench.vue` |
| `task_select` | User selects a task from the task square page (top of funnel) | `src/components/PageB.vue` |
| `task_complete` | User confirms task completion on the detail page (key conversion) | `src/components/PageC.vue` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/357071/dashboard/1399858
- **Task Completion Funnel** (task_select → task_complete): https://us.posthog.com/project/357071/insights/uzVYkuHx
- **Task Completions Over Time**: https://us.posthog.com/project/357071/insights/NWomDaxy
- **Task Selection to Completion Rate**: https://us.posthog.com/project/357071/insights/s2qrA9R5
- **Navigation Clicks by Route**: https://us.posthog.com/project/357071/insights/mF25JtCo
- **Workbench Task Entry vs Workflow Task Entry**: https://us.posthog.com/project/357071/insights/U7SoyEil

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
