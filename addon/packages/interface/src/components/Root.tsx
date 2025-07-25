import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StoreProvider } from "easy-peasy";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ToastContainer } from "react-toastify";
import { DarkLightThemeProvider, GlobalStyle, ThemePreference } from "ui-kit";
import { setDevModeIfLocalhost } from "../helpers/getSetDevMode";
import { PersistentStateKey, usePersistentState } from "../state/persistentState";
import { store } from "../store/store";
import ErrorFallback from "./ErrorFallback";
import Loading from "./Loading";
import SetProjectEnvironment from "./SetProjectEnvironment";

const queryClient = new QueryClient();

export function Root() {
    setDevModeIfLocalhost();

    const [theme, setTheme] = usePersistentState<ThemePreference>(PersistentStateKey.ThemePreference, "system");

    return (
        <StoreProvider store={store}>
            <DarkLightThemeProvider value={theme} onChange={setTheme}>
                <GlobalStyle fontFamily={"Tahoma, sans-serif"} />
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <Suspense fallback={<Loading />}>
                        <QueryClientProvider client={queryClient}>
                            <SetProjectEnvironment />
                        </QueryClientProvider>
                    </Suspense>
                    <ToastContainer />
                </ErrorBoundary>
            </DarkLightThemeProvider>
        </StoreProvider>
    );
}
