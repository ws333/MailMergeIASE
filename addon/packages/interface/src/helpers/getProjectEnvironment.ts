/* eslint-disable @typescript-eslint/no-explicit-any */
// Runtime environment detection for shared functions
import { ProjectEnvironment } from "../types/types";

declare global {
    interface Window {
        __PROJECT_TYPE__?: ProjectEnvironment;
    }

    interface GlobalThis {
        __PROJECT_TYPE__?: ProjectEnvironment;
    }
}

/**
 * Get the build-time configured project type
 * This should be set by the build process for each project
 */
function getBuildTimeProjectType(): ProjectEnvironment | undefined {
    // Check for global variable set by build process
    if (typeof globalThis !== "undefined" && (globalThis as any).__PROJECT_TYPE__) {
        return (globalThis as any).__PROJECT_TYPE__;
    }

    // Check for window variable (if in browser)
    if (typeof window !== "undefined" && window.__PROJECT_TYPE__) {
        return window.__PROJECT_TYPE__;
    }

    return undefined;
}

/**
 * - Detect which project environment the shared code is running in (addon or webapp)
 */
export function getProjectEnvironment(): ProjectEnvironment {
    // 0. Check for build-time configuration first (most reliable)
    const buildTimeType = getBuildTimeProjectType();
    if (buildTimeType) {
        return buildTimeType;
    }

    // 1. Check for browser extension environment (most reliable for addon)
    if (typeof browser !== "undefined" || typeof (globalThis as any).chrome !== "undefined") {
        return "addon";
    }

    // 2. Check for extension-specific URL protocols
    if (typeof window !== "undefined") {
        const protocol = window.location.protocol;
        if (protocol === "moz-extension:" || protocol === "chrome-extension:") {
            return "addon";
        }

        // 3. Check for webapp-specific hostnames and patterns
        const hostname = window.location.hostname;

        // Production webapp domains
        if (
            hostname.includes("onrender.com") ||
            hostname.includes("netlify.app") ||
            hostname.includes("vercel.app") ||
            hostname.includes("iase.one")
        ) {
            return "webapp";
        }

        // Development webapp (Vite default port)
        if (hostname === "localhost" && window.location.port === "5173") {
            return "webapp";
        }

        // Any other localhost ports likely webapp
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            return "webapp";
        }

        // Standard web protocols indicate webapp
        if (protocol === "http:" || protocol === "https:") {
            return "webapp";
        }
    }

    return "unknown";
}

/**
 * Check if currently running in the Thunderbird addon
 */
export function isAddonEnvironment(): boolean {
    return getProjectEnvironment() === "addon";
}

/**
 * Check if currently running in the webapp
 */
export function isWebappEnvironment(): boolean {
    return getProjectEnvironment() === "webapp";
}
