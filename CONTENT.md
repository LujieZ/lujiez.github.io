# The Lujie Chronicle: Content Draft v1

> **Step 1 of 9: review copy before any design.** This file is excluded from the site build.
> Edit inline, strike through, or leave comments as `> SUE:` lines. Anything tagged **[VERIFY]** is a claim I could not confirm from your live site, resume, marbury.ai, or public Google Cloud docs.
>
> **Voice rules:** first person, short sentences, specific nouns, no superlatives ("rising talent", "significant contributions", "invaluable" are gone). Lightly dry, never salesy.
>
> **Sources:** live site (Nov 2026), `Resume_LujieZ.pdf`, marbury.ai homepage, public GCP docs on disabling service account keys.

---

## 0. Global

| Field | Draft |
|---|---|
| Masthead | **The Lujie Chronicle** |
| Dateline | Seattle, Washington · Est. 1999 · Issue 001 · November 2026 |
| Byline | Sue Zhao (赵璐洁) |
| Site `<title>` | The Lujie Chronicle · Sue Zhao |
| Meta description | Sue Zhao builds identity infrastructure at Google Cloud and is co-founder and CPO of Marbury AI. Case studies, an archive of past work, and a way to say hello. **[VERIFY: current roles, see §2]** |
| Nav | Front Page · Work · Archive · About |
| Colophon sign-off | *Set in Seattle. Printed on the open web. Corrections welcome: lujie.sue.zhao@gmail.com.* |

---

## 1. Front Page: Cover

**Kicker:** ISSUE 001: THE BUILDER'S EDITION

**Headline:**
> Building things that should exist.

**Standfirst (one line, answers who / what / why):**
> I'm Sue. I build identity infrastructure at Google Cloud, and I co-founded Marbury AI, where we're giving litigation teams an AI team for eDiscovery.

**Alt headline options (pick one or keep the above):**
- "Secure systems by day. Useful agents by night."
- "Notes from someone who likes the plumbing."
- "From config pushes to AI agents, still shipping."

**Portrait caption:** *The editor, photographed in [year] [VERIFY: year/place of headshot.jpg].*

---

## 2. Front Page: Lead Stories (equal split)

> ⚠️ **[VERIFY, important]** Your live timeline lists *Google Cloud Security 2022–Present*, *Lead SWE at Saturday, Inc 2023–2024*, and *Co-founder & CPO, Marbury AI 2024–Present*. These overlap. Are you currently at Google **and** Marbury? If you've left Google, the left column becomes "The Google Years" (past tense) and I'll adjust the cover standfirst.

### Left: AT GOOGLE CLOUD
**Headline:** Who gets to call what
**Body (≈60 words):**
> I work on Workload Identity at Google Cloud: the control plane and data plane that let one service prove who it is to another without a long-lived secret. Before that I migrated and maintained Cloud IAM APIs, carried a support pager, and learned that a clear error message is a security feature.

**Link:** Read: *Turning keys off without breaking things* → (case study 2)

### Right: BUILDING MARBURY AI
**Headline:** An AI team for eDiscovery
**Body (≈60 words):**
> At Marbury, I'm co-founder and Chief Product Officer. We build agents that process, review, and produce documents for litigation, and they ask before they change anything and log why they made each call. Our team is lawyers and former Google engineers in Seattle. My job is deciding what the agents should never do on their own.

**Link:** Read the feature → (case study 1) · Visit marbury.ai ↗

---

## 3. Front Page: Deep Read teaser (Marbury, 3 illustrated steps)

**Section label:** THE DEEP READ
**Headline:** Agents that ask first
1. **Intake:** Containers, archives, and chat exports arrive in one place. They are de-NISTed, de-duplicated by family, OCR'd, and indexed.
2. **Review:** An agent plans the review and runs a first pass. It asks a human before tagging, redacting, or producing anything.
3. **Record:** Every call is logged with the reason it was made, so a reviewer can audit the work later.

**CTA:** Read the story →
*Diagram: illustrative, not a depiction of production architecture.*

---

## 4. Front Page: Archive strip

**Label:** FROM THE ARCHIVE · 2015 → NOW
**Intro line:** Older dispatches: robots, course websites, and my first Google project. Drag or scroll →
(Cards are generated from the Archive data in §7.)

---

## 5. Front Page: Outside the Office

**Label:** OUTSIDE THE OFFICE
**Headline:** Craftsman, programmer, dreamer
> I came to the U.S. from China for high school at sixteen, and later went to NYU as a first-generation college student. I still describe myself the way I did then: a craftsman who cares about the finish, a programmer who likes hard problems, and a dreamer who keeps a list of things that should exist.
>
> When I'm not building, I'm [VERIFY: 2–3 real interests, e.g., a place you like to walk, something you make, something you read].

---

## 6. About

**Headline:** About the editor
**Bio (≈120 words):**
> I'm Sue Zhao (赵璐洁), a software engineer and founder based in Seattle.
>
> I joined Google through the STEP internship in 2020, came back as a software engineer intern in 2021 to ship the ability to disable and enable service account keys in Cloud IAM, and went full-time in 2022. Since then I've worked on Cloud IAM APIs and Workload Identity. Between 2023 and 2024 I was lead software engineer at Saturday, Inc. **[VERIFY: one-line description of Saturday and your work there]**. In 2024 I co-founded Marbury AI, where I lead product.
>
> I studied Computer Science at NYU (B.S., Dec 2021) with minors in Mathematics and Finance.

**Selected facts (sidebar):**
- Based in Seattle, WA
- B.S. Computer Science, NYU '21 · Minors: Mathematics, Finance
- Languages I ship in: C++, Java, TypeScript, Python
- First-generation college graduate

**Contact block:**
- **Write:** lujie.sue.zhao@gmail.com: "Questions, collaborations, or hello are all welcome."
- **Meet:** "Book a time": existing Google Calendar appointment link (kept as is).
- **Elsewhere:** GitHub (LujieZ) · LinkedIn (lujiez) · X (@zhaosuesue)
- **Résumé:** View / download PDF **[VERIFY: the PDF in the repo predates Saturday & Marbury. Do you want to upload a new one?]**

---

## 7. Archive entries (dated index)

| Year | Title | Kind | One-line blurb | Link |
|---|---|---|---|---|
| 2024– | Marbury AI | Company | Co-founded an AI eDiscovery platform; I lead product. | case study + marbury.ai |
| 2023–24 | Saturday, Inc. | Role | Lead software engineer. **[VERIFY blurb]** | none |
| 2022– | Google Cloud: Workload Identity & IAM | Role | Control/data plane for workload identity; Cloud IAM APIs. **[VERIFY tense]** | none |
| 2021 | Disable & enable service account keys | Feature | Internship project; shipped to GA in Cloud IAM, gcloud, and Console. | case study + GCP docs |
| 2020–21 | Grickly | Senior design | Proof of concept for a new way to share life events. **[VERIFY: is there a link or should it be text-only?]** | none (fixes broken `/` link) |
| 2020– | NYU Intro to Engineering & Design site | Web | Led the rebuild of a course site used by 1,000+ students daily (React, Node, MySQL). | eg.poly.edu |
| 2020 | Visualizing configuration pushes | Internship | STEP capstone: D3 bar chart + box plot so engineers could compare a push against history. | /projects/barchart |
| 2019–20 | VEX library for Arduino | Library | C++ wrapper to make a robot's functions easier to call. | GitHub |
| 2019 | Mobile robotic 3D printing | Research | AI4CE Lab: simulation, image detection, and ROS calibration for a 3 m × 6 m floor-plan print. | /projects/3dprinting |
| 2018 | Entered NYU | Milestone | First-generation college student, Computer Science. | none |
| 2015 | Arrived in the U.S. | Milestone | Came from China for high school, at sixteen. | none |
| n/a | Coursework drawer | Misc | Sudoku (CS1114) · BlueV (product deck) · Predicting job changes (ML) · Two puzzles (AI) | GitHub / Slides |

---

## 8. Case Study 1: Marbury AI

**Kicker:** FEATURE · 2024–PRESENT · CO-FOUNDER & CPO
**Headline:** Agents that ask first
**Dek:** What it takes to put AI agents into a workflow where a single wrong tag can become a court problem.

**Context:**
> eDiscovery is the part of litigation where each side collects, processes, reviews, and hands over documents. It's slow, expensive, and mostly done by people clicking through tools that don't talk to each other. Marbury puts processing and review in one workspace and adds agents that do the first pass.

**My role:**
> I co-founded Marbury and lead product. That means I decide what we build and in what order, and where the line sits between what an agent does alone and what it must ask about. **[VERIFY: add 1–2 concrete things you personally own, e.g., the review suite UX, the agent permission model.]**

**The constraint:**
> Legal teams can't use a black box. Every decision has to be explainable, reversible before production, and defensible later. Client data can't be used to train models.

**Visual explanation** *(SVG, labeled "Illustrative")*: Intake → Processing (DeNIST · dedupe · OCR · index) → Agentic Review (plan → ask → act → log) → Production / export.

**Decisions & tradeoffs:**
1. **Ask before acting.** Agents propose and humans approve changes. It's slower than full autonomy, and it's the reason a litigator will trust the output.
2. **Log the "why", not just the "what".** Each call is stored with its reason, which makes audits and privilege disputes tractable.
3. **One workspace, open exits.** Processing and review live together, but exports go to other eDiscovery platforms, so teams aren't locked in.
4. **No-training, zero-retention by default.** A product decision as much as a legal one.
**[VERIFY: are these the tradeoffs you'd name? Swap in the real debates you had.]**

**Outcome:**
> Marbury serves in-house legal teams, law firms, litigation support groups, and insurance carriers. **[VERIFY: add any public milestone (launch date, customers you can name, funding) or leave it as is. No invented metrics.]**

**Reflection:**
> Building at Google taught me how identity and permissions protect systems. Building Marbury taught me that the same idea applies to agents. The interesting design work is in the permission model.

**Next story:** Turning keys off without breaking things →

---

## 9. Case Study 2: Disable & Enable Service Account Keys

**Kicker:** FEATURE · GOOGLE CLOUD IAM · SUMMER 2021
**Headline:** Turning keys off without breaking things
**Dek:** An internship project that gave Cloud customers a reversible alternative to deleting a credential.

**Context:**
> Service account keys are long-lived credentials that let software act as a Google Cloud identity. Before 2021, if you suspected a key had leaked, your choices were to leave it or delete it. Deleting is permanent: any workload still using the key breaks, and you can't undo it.

**My role:**
> As a software engineer intern on the Cloud Identity team, I built the IAM APIs to disable and re-enable a service account key, with support in the gcloud CLI and the Cloud Console. I wrote the design doc, user guide, and support docs, coordinated engineers across four teams, and presented the project to the director. It launched to GA.

**The constraint:**
> It's a security control on a heavily used API surface. It had to behave predictably, be safe to roll out, and work the same in the API, the CLI, and the Console.

**Visual explanation** *(SVG, labeled "Illustrative")*: a key lifecycle. Before: *Created → Active → Deleted (irreversible)*. After: *Created → Active ⇄ Disabled → Deleted*. Callouts: "suspect a leak? disable" and "nothing broke? delete", "something broke? re-enable".

**Decisions & tradeoffs** *(public-level only)*:
1. **Reversible first.** Disabling gives teams a safe way to find out who's still using a key before deleting it.
2. **Same behavior everywhere.** API, gcloud (`gcloud iam service-accounts keys disable` / `enable`), and Console expose the same state.
3. **Docs as part of the feature.** The user guide shipped with the API, because a security control people don't understand doesn't get used.
**[VERIFY: confirm these are fair, and that nothing here goes beyond what's public.]**

**Outcome:**
> Generally available in Cloud IAM and documented publicly. **[VERIFY: your resume says "improved key life cycle and user experience for millions of service account key customers". Keep that claim, soften it, or drop it?]**
> Link: Google Cloud docs, "Disable and enable service account keys" ↗

**Reflection:**
> My first lesson in infrastructure: the most useful feature is sometimes an undo button.

**Next story:** Agents that ask first →

---

## 10. Content removed from the current site (for your sign-off)
- Third-person biography paragraphs ("rising talent", "significant contributions", "invaluable").
- The "What's Next" paragraph (folded into About).
- NYU quote: *"engineering isn't just about writing code…"*. **[VERIFY: did you actually say this? Keep it as a pull quote in About only if it's yours.]**
- The claim that the EG site "became a model for other course platforms at the university". Dropped as unverified unless you confirm.
- The "Inspired by The Dollar Dreadful Family Library" credit. **[Keep in colophon?]**
- The Facebook icon (already unused).
