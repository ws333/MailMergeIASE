# Interstellar Alliance Social Experiment Step 3

<br/>

Interstellar Alliance Social Experiment Step 3 is a Thunderbird add-on to send the Step 3 letter by email to a predefined online contact list.

Based on Thunderbird add-on [Mail Merge P](https://github.com/siefkenj/MailMergeP)

## Building

To build the entire extension, first run

```sh
npm install
```

then either

```sh
npm run build-and-package
```

or

```sh
npm run build
npm run build-addon
npm run package-addon
```

The extension will be located in the current directory with filename `iases3@iase.one.xpi`.

## Development

The project is divided into _npm workspaces_ located in the `packages/` directory.

- `packages/interface` the bulk of the UI code. This code runs in an iframe.
- `packages/iframe-service` an abstraction layer so that the interface can be run in the browser or in thunderbird.
- `packages/browser-preview` a browser-based implementation of the thunderbird API, so that the UI can be developed more quickly (with technology like hot-reloading)
- `packages/thunderbird-iframe-service` the connection between the real thunderbird API and `iframe-service`.
- `packages/thunderbird-extension` the actual extension's `background.js` script.

Most UI and backend work is handled by the html components. The `thunderbird-extension` runs the html
component in an iframe and uses message passing to communicate with the iframe.

This split means that the bulk of the add-on can be developed in the browser without
Thunderbird.

To run thunderbird and force a reload of all extension content, launch thunderbird with

```
thunderbird -purgecaches
```

### Developing the HTML UI

A browser-based simulation of the add-on's Thunderbird API is provided by `packages/browser-preview`.
To develop in the browser first install and build

```sh
npm install
npm run build
```

Then you can launch a dev server and open it in the browser.

```sh
cd packages/browser-preview
npx vite
```

If you want the interface code to automatically rebuild when you make a change, you can do

```sh
cd packages/interface
npx vite build --watch
```

The UI is developed using React and the Redux based state manager EasyPeasy.

### Packaging

To publish a new version bump the version in `packages/thunderbird-extension/public/manifest.json` and `package.json`.
Then run `npm i` to update `package-lock.json`
Then run `npm run build-and-package` to build the add-on file. (Stored in the root of the project folder, but excluded from the repo.)
The resulting `iases3@iase.one.xpi` is a bundle of the extension that can be uploaded to a developer account at https://addons.thunderbird.net/EN-US/developers/
(To edit the output filename see the `package-addon` script in `package.json`)

### Contact list sync and merge logic:

- There is a central online contacts list where each contact has a stable unique id (the uid field).

- Legend for fields modified in frontend:
    - sc = sent count
    - sd = sent date
    - dd = deletion date
    - cf1 = custom field 1
    - cf2 = custom field 2
- Contacts are deleted from the online contacts list when the contact no longer is part of the institution they used to belong to.

- The sc field is incremented and the sd field updated for a contact when the user sends an email to that contact.

- The goal is to keep the local contacts list in sync with the online contacts list while retaining the local stats. I.e. sc should always reflect the true sent count to the respective contact, no matter if the contact is active or deleted. This is accomplished by...

    - Updating all local ContactsI3C fields on app start/refresh expect for sd, sc, dd, cf1 and cf2 to retain the local stats.
    - If IndexedDB active contacts contains contacts not in fetched online contacts AND the contact has sc > 0, those contacts are moved from IndexedDB active contacts to IndexedDB deleted contacts, setting field dd to Date.now(), while retaining the other fields.

- The stats are calculated by combining both active and deleted contacts from IndexedDB.

- Exported files contain the date of the export. At import this export date is stored in lastImportExportDate in IndexedDB, this date is then used at the next import to determine how the import is to be applied.

- To sum up the requirements of the logic:

    - The sc stats are to be kept accurate in all possible scenarios, i.e. always reflect the true sent count. _The exception is if there has been sending from multiple devices without exporting and importing sequentially between sending sessions, which would create overlapping stats and scew the sent counts_.
    - Users can:

        - Send emails (i.e. increment sc) in multiple sessions
        - Export files in between sending sessions
        - Import any previous export multiple times in between sending sessions
        - Do these actions in any order on one device, but only send emails/export/import in sequence when using multiple devices.

### Other notes

- Much of code from the add-on Mail Merge P which this add-on is built on is now obsolete, but it is kept in case it will be needed later. Examples are code to read and parse a spreadsheet file and related preferences, and the original SendDialog.

- The state manager used is [easy-peasy](https://easy-peasy.vercel.app/) which is based on Redux. See `packages/interface/src/model.ts`.

- SINGLE_CONTACT_MODE is not in use.
