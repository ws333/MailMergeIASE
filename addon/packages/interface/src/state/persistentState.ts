import { createPersistentStateManager } from "ui-kit";
import { createPersistentStateHook } from "ui-kit";
import { TemporaryStorage } from "ui-kit";
import { LocalStorage } from "ui-kit";

export enum PersistentStateKey {
    ThemePreference = "themePreference",
    ShowOnceEducation = "showOnceEducation",
    HabitsEducationWasAt = "habitsEducationWasAt",
}

const persistentStorage =
    typeof window !== "undefined" ? new LocalStorage<PersistentStateKey>() : new TemporaryStorage<PersistentStateKey>();

export const usePersistentState = createPersistentStateHook<PersistentStateKey>(persistentStorage);

export const managePersistentState = createPersistentStateManager<PersistentStateKey>(persistentStorage);
