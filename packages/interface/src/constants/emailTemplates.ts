import LetterEnglish from "../components/letters/LetterEnglish";
import LetterNorwegian from "../components/letters/LetterNorwegian";

export const subjects: Subjects = {
    English: [
        "The Interstellar Alliance Social Experiment Group",
        "Public Disclosure of UFO/UAP Information",
        "Call for Transparency on UFO/UAP and Extraterrestrial presence",
        "End UFO secrets now, begin public education",
        "Petition for UFO/UAP Disclosure within One year",
        "Custom Subject",
    ],
    Norwegian: [
        "Åpenhet og offentliggjøring av UAP informasjon",
        "Støtt frigjøringen av UAP-informasjon",
        "Offentliggjøring av informasjon angående UAP",
        "Forespørsel om offentliggjøring av UAP-informasjon",
        "Tilpasset Emne",
    ],
};

export const emailComponents = {
    English: LetterEnglish,
    Norwegian: LetterNorwegian,
};

export type LanguageOption = keyof typeof emailComponents;
export type Subjects = Record<LanguageOption, string[]>;
export type SubjectPerLanguage = { [K in LanguageOption]?: string };

export const defaultLanguage: LanguageOption = "English";
export const defaultLanguageOptions = Object.keys(emailComponents) as LanguageOption[];
