# Nuxt translations

Translations of the Nuxt documentation, maintained with [diglot](https://github.com/danielroe/diglot). French is the first locale.

To contribute a translation, see [`CONTRIBUTING.md`](./CONTRIBUTING.md); discussion happens in [this thread](https://github.com/nuxt/translations/discussions/8).

## Sources

The documents to translate are listed in [`sources.yml`](./sources.yml):

| Source | Repository | Ref | Directory |
| --- | --- | --- | --- |
| `nuxt-main` | [`nuxt/nuxt`](https://github.com/nuxt/nuxt) | `main` | `docs` |
| `nuxt-4.x` | [`nuxt/nuxt`](https://github.com/nuxt/nuxt) | `4.x` | `docs` |
| `nuxt-3.x` | [`nuxt/nuxt`](https://github.com/nuxt/nuxt) | `3.x` | `docs` |
| `nuxt-cli` | [`nuxt/cli`](https://github.com/nuxt/cli) | `main` | `docs` |
| `nuxt-fonts` | [`nuxt/fonts`](https://github.com/nuxt/fonts) | `main` | `docs` |

## Layout

diglot splits each document into segments (a paragraph, a heading, a list item, a frontmatter field, a code comment). Links, inline code, components and HTML are replaced with numbered placeholders such as `{0}`, and a segment is identified by the hash of that placeholder skeleton. The same text in several pages or branches is one segment and only needs to be translated once.

| Path | Contents |
| --- | --- |
| `<locale>/segments/<hh>/<hash>.json` | One translation record per segment, where `<hh>` is the first two characters of the hash |
| `<locale>/glossary.yml` | Terminology for the locale |
| `<locale>/style.yml` | Style rules and typography for the locale |
| `<locale>/locale.yml` | Machine translation switch for the locale |
| `glossary.yml` | Terminology shared by every locale |
| `diglot.config.ts` | Locales and machine translation settings |
| `sources.yml` | Repositories, refs and directories to translate |
| `.diglot/manifest/<source>.json` | The segments of each source at the last run |
| `.diglot/lineage.json` | Which segments evolved from which, so a changed segment can reuse its previous translation |
| `.diglot/rejected/<locale>.json` | Machine translations rejected by the checks, with the reasons |
| `dist/<locale>.json` | The bundle served to the docs site |

A record looks like this:

```json
{
  "hash": "baf35e0f2e2e1937",
  "source": "If you want to play around with Nuxt in your browser, you can {0}try it out in one of our online sandboxes{/0}.",
  "text": "Si vous souhaitez essayer Nuxt dans votre navigateur, vous pouvez {0}le tester dans l'un de nos bacs à sable en ligne{/0}.",
  "origin": "mt",
  "review": "none",
  "derived": "fresh",
  "mt": {
    "model": "anthropic/claude-sonnet-5.5",
    "promptVersion": "1",
    "candidate": "Si vous souhaitez essayer Nuxt dans votre navigateur, vous pouvez {0}le tester dans l'un de nos bacs à sable en ligne{/0}."
  },
  "updatedAt": "2026-11-02T08:58:30.219Z"
}
```

- `origin` is how the text was produced: `mt` (machine translation), `tm` (translation memory) or `human`.
- `review` is what a person has done with it since: `none`, `edited`, `verified` or `rejected`.
- `derived` is how it relates to `prev`, the record it was derived from: `fresh` (no predecessor), `carry` (same text, new hash) or `update` (updated from the source change).
- `mt` keeps the model and its unedited output, so reviewer edits can be measured.

The `.diglot/` state and `dist/` are written by the workflow. Edit records, glossaries and style files only.

## How translations get here

### Machine translation

The [`translate`](./.github/workflows/translate.yml) workflow runs the [diglot Action](https://github.com/danielroe/diglot/tree/main/packages/action). It fetches every source, compares it with the stored manifests, and for each locale with machine translation on:

- a segment whose skeleton did not change keeps its record, so edits to links, code, components and HTML need no new translation;
- a segment whose wording changed gets its previous translation updated from the word diff;
- new segments are translated page by page with the glossary and style rules of the locale.

Each result is checked (placeholders, glossary terms, numbers, untranslated or truncated output) before it is written; rejected segments are listed in `.diglot/rejected/<locale>.json` and skipped until their source changes. The workflow then rebuilds `dist/<locale>.json` and pushes one commit. Machine-translated records start with `review: none`.

### Human edits

Translators review and edit records either in the editor on [nuxt.com](https://nuxt.com) (coming soon) or through pull requests. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the workflow, the review states and the placeholder rules.

To check records locally:

```bash
pnpm validate
pnpm status
```

## Running the workflow

The `translate` workflow runs:

- when a source repository sends a `repository_dispatch` of type `source-push`, with `client_payload.sources` naming the sources to refresh;
- daily, to catch anything missed;
- by hand from the Actions tab, with optional `sources` (comma separated names from `sources.yml`) and `limit` (the most segments per locale sent to the model in one run).

```bash
gh workflow run translate --repo nuxt/translations -f limit=200
gh api repos/nuxt/translations/dispatches -f event_type=source-push -f 'client_payload[sources]=nuxt-main'
```

Segments left over by `limit` are picked up by the next run. A run with nothing left to translate makes no model calls.

## Switching machine translation off

Set `mt.enabled` to `false` in `<locale>/locale.yml`:

```yaml
mt:
  enabled: false
```

The workflow then writes no new records for that locale. Existing records stay in the bundle, and changed segments wait for a translator.

## French style

- Address the reader as `vous`; instructions in the imperative.
- `nous` only when the Nuxt team speaks; a "we" or "let's" that walks the reader through a step becomes `vous` or an impersonal form.
- Sentence case in headings, titles and labels.
- Code identifiers, file names, package names and configuration keys stay in English.
- Guillemets (`« »`) for quoted prose.
- List items of one list share the same grammatical form.
- A narrow no-break space (U+202F) before `;`, `:`, `!`, `?` and `»`, and after `«`. Machine output gets it from `typography` in [`fr/style.yml`](./fr/style.yml).

Terminology is in [`glossary.yml`](./glossary.yml) and [`fr/glossary.yml`](./fr/glossary.yml).

## License

Published under the [MIT License](./LICENSE).
