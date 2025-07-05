import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactI3C } from "../types/typesI3C";
import { ERROR_EMPTY_CONTACTS_ARRAY } from "../constants/constants";

// Define mocks at the top
const mockCsvParse = vi.fn();
const mockFetch = vi.fn();
const mockInitializeStorage = vi.fn();
const mockGetActiveContacts = vi.fn();
const mockStoreActiveContacts = vi.fn();
const mockStoreDeletedContacts = vi.fn();
const mockRemoveActiveContactByUid = vi.fn();
const mockGetDeletedContacts = vi.fn();

// Mock toast
vi.mock("react-toastify", () => ({
    toast: {
        error: vi.fn(),
        success: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock csvParse
vi.mock("./csvParse", () => ({
    csvParse: mockCsvParse,
}));

// Mock './indexedDB'
vi.mock("./indexedDB", () => ({
    initializeStorage: mockInitializeStorage,
    getActiveContacts: mockGetActiveContacts,
    getDeletedContacts: mockGetDeletedContacts,
    storeActiveContacts: mockStoreActiveContacts,
    storeDeletedContacts: mockStoreDeletedContacts,
    removeActiveContactByUid: mockRemoveActiveContactByUid,
}));

describe("fetchAndMergeContacts", () => {
    const mockDateNow = 1677600000000; // Feb 28, 2023, 08:40:00 UTC
    let fetchAndMergeContacts: typeof import("./fetchAndMergeContacts").fetchAndMergeContacts;
    let checkOverlapIndexedDBActiveAndDeletedContacts: typeof import("./checkOverlapInData").checkOverlapIndexedDBActiveAndDeletedContacts;

    const mockFetchFn = vi.fn(async (): Promise<ContactI3C[]> => {
        const response = await mockFetch("some-url");
        const csvText = await response.text();
        return mockCsvParse(csvText).data;
    });

    beforeEach(async () => {
        // Dynamically import the modules after mocks are set up
        ({ fetchAndMergeContacts } = await import("./fetchAndMergeContacts"));
        ({ checkOverlapIndexedDBActiveAndDeletedContacts } = await import("./checkOverlapInData"));

        vi.useFakeTimers();
        vi.setSystemTime(mockDateNow);
        vi.clearAllMocks();
        console.error = vi.fn(); // Mock console.error
        console.table = vi.fn();

        mockFetch.mockReset();
        mockCsvParse.mockReset();
        mockInitializeStorage.mockReset();
        mockGetActiveContacts.mockReset();
        mockGetDeletedContacts.mockReset();
        mockStoreActiveContacts.mockReset();
        mockStoreDeletedContacts.mockReset();
        mockRemoveActiveContactByUid.mockReset();

        // Default setup to avoid overlap
        mockGetDeletedContacts.mockResolvedValue([]);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("handles empty online", async () => {
        mockFetch.mockResolvedValue({ text: async () => "" });
        mockCsvParse.mockReturnValue({ data: [] });
        mockGetActiveContacts.mockResolvedValue([]);

        await expect(fetchAndMergeContacts(mockFetchFn)).rejects.toThrow(ERROR_EMPTY_CONTACTS_ARRAY);
    });

    it("handles online contacts with empty local contacts", async () => {
        mockFetch.mockResolvedValue({
            text: async () =>
                "uid,na,i,s,n,e,sd,sc,ud,dd,cb1,cb2,cf1,cf2\n" +
                "1,US,Inst,Group,Test,test@example.com,1677580000000,1,2023-01-01,0,CB1,CB2,,",
        });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 1,
                    na: "US",
                    i: "Inst",
                    s: "Group",
                    n: "Test",
                    e: "test@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });
        mockGetActiveContacts.mockResolvedValue([]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 0,
                sc: 0,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "",
                cf2: "",
            },
        ]);
        expect(mockStoreActiveContacts).toHaveBeenCalledWith([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 0,
                sc: 0,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "",
                cf2: "",
            },
        ]);
    });

    it("merges overlapping contacts with local data preserved", async () => {
        mockFetch.mockResolvedValue({
            text: async () =>
                "uid,na,i,s,n,e,sd,sc,ud,dd,cb1,cb2,cf1,cf2\n" +
                "1,US,Inst,Group,Test,test@example.com,1677570000000,1,2023-01-01,0,CB1,CB2,,",
        });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 1,
                    na: "US",
                    i: "Inst",
                    s: "Group",
                    n: "Test",
                    e: "test@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });
        mockGetActiveContacts.mockResolvedValue([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1-old",
                cb2: "CB2-old",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);
        expect(mockStoreActiveContacts).toHaveBeenCalledWith([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);
    });

    it("handles local contact not in online (deleted)", async () => {
        mockFetch.mockResolvedValue({
            text: async () =>
                "uid,na,i,s,n,e,sd,sc,ud,dd,cb1,cb2,cf1,cf2\n" +
                "1,US,Inst,Group,Test1,test1@example.com,1677580000000,1,2023-01-01,0,CB1,CB2,,",
        });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 1,
                    na: "US",
                    i: "Inst",
                    s: "Group",
                    n: "Test1",
                    e: "test1@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });
        mockGetActiveContacts.mockResolvedValue([
            {
                uid: 2,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test2",
                e: "test2@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test1",
                e: "test1@example.com",
                sd: 0,
                sc: 0,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "",
                cf2: "",
            },
        ]);
        expect(mockStoreDeletedContacts).toHaveBeenCalledWith(
            expect.objectContaining({
                uid: 2,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test2",
                e: "test2@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: mockDateNow,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            })
        );
        expect(mockRemoveActiveContactByUid).toHaveBeenCalledWith(2);
    });

    it("handles abort signal", async () => {
        mockFetch.mockRejectedValue(new DOMException("Aborted", "AbortError"));
        mockGetActiveContacts.mockResolvedValue([]);

        const abortingController = new AbortController();
        abortingController.abort();
        await expect(fetchAndMergeContacts(mockFetchFn)).rejects.toThrow("Aborted");
        expect(mockStoreDeletedContacts).not.toHaveBeenCalled();
    });

    it("detects overlap between active and deleted contacts", async () => {
        // Instead of empty data, provide at least one contact
        mockFetch.mockResolvedValue({
            text: async () =>
                "uid,na,i,s,n,e,sd,sc,ud,dd,cb1,cb2,cf1,cf2\n3,CA,Inst,Group,Test3,test3@example.com,1677580000000,1,2023-01-01,0,CB1,CB2,,",
        });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 3, // Different UID to not interfere with the overlap test
                    na: "CA",
                    i: "Inst",
                    s: "Group",
                    n: "Test3",
                    e: "test3@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });

        // Setup overlap between active and deleted contacts
        const activeContacts = [
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ];

        const deletedContacts = [
            {
                uid: 1, // Same UID as in active contacts
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677580000000,
                sc: 2,
                ud: "2023-01-01",
                dd: mockDateNow,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "CF1",
                cf2: "CF2",
            },
        ];

        mockGetActiveContacts.mockResolvedValue(activeContacts);
        mockGetDeletedContacts.mockResolvedValue(deletedContacts);

        await fetchAndMergeContacts(mockFetchFn);
        expect(console.error).toHaveBeenCalledWith("Overlap between active and deleted contacts in indexedDB!");
    });

    it("handles local contact with missing fields", async () => {
        mockFetch.mockResolvedValue({
            text: async () =>
                "uid,na,i,s,n,e,sd,sc,ud,dd,cb1,cb2,cf1,cf2\n" +
                "1,US,Inst,Group,Test,test@example.com,1677570000000,1,2023-01-01,0,CB1,CB2,,",
        });
        mockCsvParse.mockReturnValue({
            data: [
                {
                    uid: 1,
                    na: "US",
                    i: "Inst",
                    s: "Group",
                    n: "Test",
                    e: "test@example.com",
                    sd: 0,
                    sc: 0,
                    ud: "2023-01-01",
                    dd: 0,
                    cb1: "CB1",
                    cb2: "CB2",
                    cf1: "",
                    cf2: "",
                },
            ],
        });
        mockGetActiveContacts.mockResolvedValue([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677570000000,
                sc: 1,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1-old",
                cb2: "CB2-old",
                cf1: "",
                cf2: "",
            },
        ]);

        const result = await fetchAndMergeContacts(mockFetchFn);

        expect(result).toEqual([
            {
                uid: 1,
                na: "US",
                i: "Inst",
                s: "Group",
                n: "Test",
                e: "test@example.com",
                sd: 1677570000000,
                sc: 1,
                ud: "2023-01-01",
                dd: 0,
                cb1: "CB1",
                cb2: "CB2",
                cf1: "",
                cf2: "",
            },
        ]);
    });

    // Test for the checkNoOverlapActiveDeletedContacts function
    it("checkNoOverlapActiveDeletedContacts detects overlap correctly", async () => {
        // Setup overlap between active and deleted contacts
        const activeContacts = [
            { uid: 1, na: "US", e: "test1@example.com" },
            { uid: 2, na: "UK", e: "test2@example.com" },
        ] as ContactI3C[];

        const deletedContacts = [
            { uid: 1, na: "US", e: "test1@example.com" }, // Overlapping UID
            { uid: 3, na: "CA", e: "test3@example.com" },
        ] as ContactI3C[];

        mockGetActiveContacts.mockResolvedValue(activeContacts);
        mockGetDeletedContacts.mockResolvedValue(deletedContacts);

        const result = await checkOverlapIndexedDBActiveAndDeletedContacts();

        expect(result).toBe(true); // Should detect overlap
        expect(console.table).toHaveBeenCalled();
    });

    it("checkNoOverlapActiveDeletedContacts reports no overlap when none exists", async () => {
        // Setup non-overlapping contacts
        const activeContacts = [
            { uid: 1, na: "US", e: "test1@example.com" },
            { uid: 2, na: "UK", e: "test2@example.com" },
        ] as ContactI3C[];

        const deletedContacts = [
            { uid: 3, na: "CA", e: "test3@example.com" },
            { uid: 4, na: "DE", e: "test4@example.com" },
        ] as ContactI3C[];

        mockGetActiveContacts.mockResolvedValue(activeContacts);
        mockGetDeletedContacts.mockResolvedValue(deletedContacts);

        const result = await checkOverlapIndexedDBActiveAndDeletedContacts();

        expect(result).toBe(false); // Should not detect overlap
        expect(console.table).not.toHaveBeenCalled();
    });

    // Test for the checkIfActiveAndOnlineContactsSynced function
    describe("checkIfActiveAndOnlineContactsSynced", () => {
        let checkIfActiveAndOnlineContactsSynced: typeof import("./checkOverlapInData").checkIfActiveAndOnlineContactsSynced;

        beforeEach(async () => {
            ({ checkIfActiveAndOnlineContactsSynced } = await import("./checkOverlapInData"));
            console.warn = vi.fn();
            console.table = vi.fn();
        });

        it("returns 0 and does not warn when all local contacts are present online", async () => {
            const activeContacts = [
                { uid: 1, na: "US", e: "test1@example.com" },
                { uid: 2, na: "UK", e: "test2@example.com" },
            ] as ContactI3C[];
            mockGetActiveContacts.mockResolvedValue(activeContacts);

            const onlineContactUids = new Set([1, 2]);
            const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

            expect(result).toBe(0);
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.table).not.toHaveBeenCalled();
        });

        it("returns correct count and warns when some local contacts are missing online", async () => {
            const activeContacts = [
                { uid: 1, na: "US", e: "test1@example.com" },
                { uid: 2, na: "UK", e: "test2@example.com" },
                { uid: 3, na: "CA", e: "test3@example.com" },
            ] as ContactI3C[];
            mockGetActiveContacts.mockResolvedValue(activeContacts);

            const onlineContactUids = new Set([1, 2]);
            const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

            expect(result).toBe(1);
            expect(console.warn).toHaveBeenCalledWith("Active local contacts not found online (1):");
            expect(console.table).toHaveBeenCalledWith([{ uid: 3, na: "CA", e: "test3@example.com" }]);
        });

        it("returns correct count and warns when all local contacts are missing online", async () => {
            const activeContacts = [
                { uid: 10, na: "FR", e: "test10@example.com" },
                { uid: 20, na: "DE", e: "test20@example.com" },
            ] as ContactI3C[];
            mockGetActiveContacts.mockResolvedValue(activeContacts);

            const onlineContactUids = new Set<number>();
            const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

            expect(result).toBe(2);
            expect(console.warn).toHaveBeenCalledWith("Active local contacts not found online (2):");
            expect(console.table).toHaveBeenCalledWith([
                { uid: 10, na: "FR", e: "test10@example.com" },
                { uid: 20, na: "DE", e: "test20@example.com" },
            ]);
        });

        it("returns 0 and does not warn when there are no local contacts", async () => {
            mockGetActiveContacts.mockResolvedValue([]);

            const onlineContactUids = new Set([1, 2, 3]);
            const result = await checkIfActiveAndOnlineContactsSynced(onlineContactUids);

            expect(result).toBe(0);
            expect(console.warn).not.toHaveBeenCalled();
            expect(console.table).not.toHaveBeenCalled();
        });
    });
});
