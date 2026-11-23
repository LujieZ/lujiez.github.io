# The Lujie Chronicle: Content Draft v2

> **Step 1 of 9: review copy before design.** Excluded from the site build.
> Edit inline or add `> SUE:` comments. **[VERIFY]** marks anything still unconfirmed.
>
> **v2 changes:** rebuilt from the Nov 2026 résumé. Marbury role corrected to Co-founder & CTO. The old "Google Years / NYU Chapter / Beyond the Code / What's Next" columns are deleted entirely; see §10 for where each one went. I rewrote the copy to be plainer: facts first, no slogans, no "rising talent" voice, and no invented quotes.
>
> **Sources:** `Lujie_Zhao_Resume (Nov 26).pdf`, the current site, marbury.ai.
>
> **Left out on purpose:** internal numbers that read as confidential on a public site: the 8% of requests, the 15% outage, Sev0 counts, and spot bonuses/peer awards. Tell me if you want any of them back.

---

## 0. Global

| Field | Draft |
|---|---|
| Masthead | The Lujie Chronicle |
| Dateline | Seattle, Washington · Est. 1999 · Issue 001 · November 2026 |
| Byline | Sue Zhao (赵璐洁) |
| Page title | The Lujie Chronicle · Sue Zhao |
| Meta description | Sue Zhao is a software engineer on Google Cloud Security and co-founder and CTO of Marbury AI. |
| Nav | Front Page · Work · Archive · About |
| Colophon | Made in Seattle. Corrections and hellos: lujie.sue.zhao@gmail.com. |

> Email confirmed: `lujie.sue.zhao@gmail.com`.

---

## 1. Cover

**Headline:** Building things that should exist.

**Standfirst:**
> I'm Sue. I work on identity for AI agents and workloads at Google Cloud, and I'm building Marbury AI, an eDiscovery platform for legal teams.

---

## 2. Lead stories (equal split)

### At Google Cloud
**Headline:** Identity for agents
> I've been at Google since 2022, on Cloud Security. Most of my work is about how software proves who it is.
>
> Lately that software is AI agents. I designed how Agent Gateway injects OAuth tokens on the way out, so agents never hold them. I also shipped proof-of-possession token binding across our identity services, and built the services behind Gemini's role suggestions in the Cloud Console.

Link: Earlier at Google: service account keys →

### At Marbury AI
**Headline:** An eDiscovery platform, from the first commit
> I co-founded Marbury in 2024 and I'm the CTO. We help legal teams process and review documents for litigation without giving up control of the process.
>
> I built the platform from the start: a document pipeline (Docling and FastAPI), hybrid semantic search on OpenSearch, and an AI review agent that keeps an audit trail.

Link: Read the story → · marbury.ai ↗

---

## 3. Deep Read teaser (Marbury)

**Headline:** A review agent you can audit
1. **Ingest:** Documents go through a Docling + FastAPI pipeline that extracts text and structure.
2. **Search:** Keyword and semantic search run side by side on OpenSearch.
3. **Review:** The agent tags and flags documents and records why, so a lawyer can check every call.

Read the story →
*Diagram is illustrative.*

---

## 4. Archive strip

**Label:** From the archive, 2015 to now
**Line:** Robots, a course website, and my first Google projects.

---

## 5. Outside the Office

**Headline:** A little more about me
> I moved from China to the U.S. for high school when I was sixteen, then went to NYU as the first in my family to go to college. Outside work I paint and work out.
>
> At Google I've mentored engineers, helped an intern convert to full-time, and organized a 500-person event as a Women@ ambassador.

---

## 6. About

**Headline:** About
> I'm Sue Zhao (赵璐洁), a software engineer in Seattle.
>
> At Google Cloud Security I work on agentic identity and workload identity: service accounts, service agents, token binding, and access controls for AI agents. I also do Tier-0 on-call, and I've consulted for teams like Compute Engine, GKE, Vertex AI, and Waymo on workload identity design.
>
> Outside Google, I'm co-founder and CTO of Marbury AI. From 2023 to 2024 I led engineering part-time at Saturday Inc, building a coach portal for team orders, seat assignments, and subscription payments.
>
> I studied Computer Science at NYU (B.S. 2021, magna cum laude) with minors in math and finance.

**Contact:**
- Email: lujie.sue.zhao@gmail.com
- Book a time: existing Google Calendar link
- GitHub · LinkedIn · X
- Résumé (PDF): Nov 2026 version (done on branch)

---

## 7. Archive entries

| Year | Title | One line | Link |
|---|---|---|---|
| 2024– | Marbury AI | Co-founder & CTO. Built the platform from the first commit. | case study, marbury.ai |
| 2023–24 | Saturday Inc | Lead engineer (part-time). Coach portal for orders, seating, and payments. | none |
| 2022– | Google Cloud Security | Agentic identity, workload identity, service identity platform. | none |
| 2021 | Disable/enable service account keys | Internship project. Shipped to GA in IAM, gcloud, and Console. | case study, GCP docs |
| 2020–21 | NYU course website | Led the rebuild of the Intro to Engineering site, 1,000+ daily users. | eg.poly.edu |
| 2020–21 | Grickly | NYU senior design project. [VERIFY: keep? Is there a link?] | none |
| 2020 | Config push timelines | STEP internship. D3.js push timelines for 2,000+ daily users. | /projects/barchart |
| 2019–20 | VEX library | C++ library for controlling a VEX robot with Arduino. | GitHub |
| 2019 | Mobile robot 3D printing | AI4CE Lab. TurtleBot3 robots that printed a 2D floor plan. | /projects/3dprinting |
| 2018 | Started at NYU | Computer Science. | none |
| 2015 | Moved to the U.S. | High school, age sixteen. | none |
| n/a | Coursework | Sudoku, BlueV, job-change prediction, two AI puzzles. | GitHub |

---

## 8. Case study: Marbury AI

**Kicker:** 2024–present · Co-founder & CTO (part-time)
**Headline:** A review agent you can audit

**Context**
> In litigation, both sides collect, process, and review large sets of documents. This is called eDiscovery. The work is slow and expensive, and legal teams are careful about handing any of it to AI they can't inspect.

**My role**
> I co-founded Marbury and built the platform from the first commit. I lead development.

**Constraint**
> Lawyers have to be able to explain every decision about a document. So anything the AI does needs a record that a person can review.

**Next:** Service account keys →

---

## 9. Case study: Service account keys

**Kicker:** Google Cloud IAM · 2021 internship, plus follow-up work after joining full-time
**Headline:** Switching off a key without deleting it

**Context**
> Service account keys are long-lived credentials. Until 2021, if you thought a key had leaked, the only fix was to delete it. Deleting a key breaks anything still using it, and you can't undo it.

**My role**
> As an intern in 2021, I designed and implemented the IAM APIs to disable and re-enable a key. I worked with four teams to add it to gcloud and the Cloud Console, and launched it to GA. It's available to millions of users.
>
> After joining full-time, I built the API and Console support for automatically disabling leaked keys. This is now on by default across Google Cloud.

**Diagram (illustrative)**
> Before: created → active → deleted.
> After: created → active ⇄ disabled → deleted, plus "leak detected → auto-disabled".

**Why it matters**
> Disabling lets you find out what depends on a key before you delete it. Auto-disable means a leaked key stops working even if nobody is watching.

**Link:** Google Cloud docs ↗
**Next:** Marbury AI →

---

## 10. What happened to the old homepage columns

| Old section | Now |
|---|---|
| THE GOOGLE YEARS: "Building Security at Scale" | **Deleted.** Replaced by the short "At Google Cloud" story (§2). STEP and the internship are archive entries and case study §9. |
| THE NYU CHAPTER: "Triple Focus, Singular Vision" | **Deleted**, including the quote. NYU appears as one line in About plus archive entries. The "model for other platforms" claim is dropped. |
| BEYOND THE CODE: "A Craftsman's Philosophy" | **Deleted.** Replaced by the short "A little more about me" (§5). |
| What's Next | **Deleted.** |
| Timeline block | Moved into the Archive (§7). |
| Dollar Dreadful credit | [VERIFY: keep in the footer?] |
