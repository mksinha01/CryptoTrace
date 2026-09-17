# CryptoTrace LEA Frontend Demo

Frontend-only SIH 26183 demo for CryptoTrace LEA. The app is a typed React/Vite investigator workstation backed by `04_DEMO_FIXTURE.json` through `src/services/mockApi.ts`.

## Run

```bash
npm install
npm run dev
```

Local URL: `http://127.0.0.1:5173/`

## Validate

```bash
npm run lint
npm run build
```

## Demo Boundary

All runtime intelligence in this implementation is fixture-backed and visibly labelled `FIXTURE REPLAY` / `DEMO DATA`. It does not connect to live blockchain providers, NCRP, SAHYOG, VASP systems, PostgreSQL, Redis, graph databases, legal filing systems, or fund-freezing mechanisms.

The mock API layer preserves production terminology so real backend endpoints can later replace the fixture service without redesigning the UI.
