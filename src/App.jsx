// Import Dependencies
import { RouterProvider } from "react-router";

// Local Imports
import { AuthProvider } from "app/contexts/auth/Provider";
import { BreakpointProvider } from "app/contexts/breakpoint/Provider";
import { LocaleProvider } from "app/contexts/locale/Provider";
import { SidebarProvider } from "app/contexts/sidebar/Provider";
import { ThemeProvider } from "app/contexts/theme/Provider";
import { RightSidebarProvider } from "app/contexts/sidebar-right/rightSidebar";
import router from "app/router/router";
import { ToastProvider } from "app/contexts/toast-provider/ToastProvider.component";




function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LocaleProvider>
          <BreakpointProvider>
            <SidebarProvider>
              <RightSidebarProvider>
                <ToastProvider>
                  <RouterProvider router={router} />
                </ToastProvider>
              </RightSidebarProvider>
            </SidebarProvider>
          </BreakpointProvider>
        </LocaleProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;