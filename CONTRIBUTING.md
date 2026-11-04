# Contributing

Anyone can translate: open a pull request and we'll review and merge it. 🚀

Node 22.18 or later and pnpm 12 are required.

## Setup

```bash
git clone https://github.com/nuxt/translations.git
cd translations
pnpm install
pnpm checkout
pnpm x18n status
```

`pnpm checkout` fetches the source repositories and exports them under `.diglot/sources/`, so x18n can tell you where each segment appears. `pnpm x18n ui` opens the editor in a browser.

## Review vocabulary

Every record has a state:

- `machine`: this was translated by AI, and no one has reviewed it yet (`review: none`).
- `edited`: a person has changed the text (`review: edited`).
- `verified`: a reviewer has approved it (`review: verified` with `verifiedBy`).
- `rejected`: a reviewer has rejected it (`review: rejected` with `rejectedBy`), or the checks fail it; machine translations that fail the checks are listed in `.diglot/rejected/fr.json`.

`pnpm status` shows the counts per state and per source.

## Editing

Edit either on [nuxt.com](https://nuxt.com) (coming soon) or locally:

- On nuxt.com, the editor will open a pull request for you.
- Locally, change a record and open a pull request. In x18n, editing a value sets `review` to `edited`.

To approve a record you have read:

```bash
pnpm x18n review approve <hash> --locale fr
```

This writes `review: verified` and `verifiedBy` into the record. The `verifiedBy.by` field is your GitHub login when the commit author is a GitHub noreply address or `gh` is logged in, otherwise the git name. Then commit the record and open a pull request.

## Placeholders

`source` holds the segment with numbered placeholders such as `{0}` or `{0}...{/0}`. They stand for links, code, components and HTML. Keep every placeholder of `source` in `text`, exactly once. `pnpm validate` rejects a record whose placeholders do not match.

## Glossary and style

Terminology lives in [`glossary.yml`](./glossary.yml) (shared by all locales) and [`fr/glossary.yml`](./fr/glossary.yml) (French only). Style rules and typography live in [`fr/style.yml`](./fr/style.yml).

Propose a glossary change in the same pull request as the translations that use it.

## Review

Members of `nuxt/translators-fr` review each pull request: the placeholders, glossary terms, style and the translation itself. Keep the change focused.
