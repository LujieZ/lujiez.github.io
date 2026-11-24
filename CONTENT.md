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
> I'm Sue Zhao, a software engineer in Seattle. At Google Cloud I work on how AI agents prove who they are, and I co-founded Marbury AI, which helps lawyers review case documents.

---

## 2. Lead stories (equal split)

### At Google Cloud
**Headline:** Identity for agents
> I've been at Google since 2022, on Cloud Security. Most of my work is about how software proves who it is.
>
> Lately that software is AI agents. I work on letting agents use the tools they need without ever holding the keys themselves, and on making a stolen credential useless to whoever took it. I also built the part of Google Cloud where Gemini suggests what access people should have.

Link: Earlier at Google: service account keys →

### At Marbury AI
**Headline:** An eDiscovery platform, from the first commit
> I co-founded Marbury in 2024 and I'm the CTO. We help legal teams process and review documents for litigation without giving up control of the process.
>
> I built the platform from the start. It reads in a case's documents, lets lawyers search them by exact words or by meaning, and has an AI reviewer that writes down the reason for every call it makes.

Link: Read the story → · marbury.ai ↗

---

## 3. Deep Read teaser (Marbury)

**Headline:** A review agent you can audit
1. **Ingest:** Documents come in, and the platform pulls out their text and layout.
2. **Search:** Lawyers can search by exact words and by meaning at the same time.
3. **Review:** The agent tags and flags documents and records why, so a lawyer can check every call.

Read the story →
*Diagram is illustrative.*

---

## 4. Archive strip

**Label:** From the archive, 2015 to now
**Line:** Robots, a course website, and my first Google projects.

---

## 5. Outside the Office

> **Update (Nov 24):** the About page was removed. Its content now lives in this front-page section ("About the author · A little more about me"); see `index.html`. Contact and Résumé are separate pages again, as on the old site. `/about/` forwards to `/#about`.

**Headline:** A little more about me
> I moved from China to the U.S. for high school when I was sixteen, then went to NYU as the first in my family to go to college. Outside work I paint and work out.
>
> At Google I've mentored engineers, helped an intern convert to full-time, and organized a 500-person event as a Women@ ambassador.

---

## 6. About

> **Superseded:** this text was folded into §5 on the front page.

**Headline:** About
> I'm Sue Zhao (赵璐洁), a software engineer in Seattle.
>
> At Google Cloud Security I work on identity: how AI agents and other software prove who they are, and what they're allowed to do. I'm also on call for some of Google Cloud's most critical systems, and I've advised teams across Google Cloud, and at Waymo, on how their software should handle identity.
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
| 2023–24 | Saturday Inc | Lead engineer (part-time). Coach portal for orders, seating, and payments. | saturday.fit |
| 2022– | Google Cloud Security | Identity and access for AI agents and the software that runs on Google Cloud. | none |
| 2021 | Disable/enable service account keys | Internship project. Launched to every Google Cloud customer. | case study, GCP docs |
| 2020–21 | NYU course website | Led the rebuild of the Intro to Engineering site, 1,000+ daily users. | eg.poly.edu |
| 2020–21 | Grickly | NYU senior design project. | none |
| 2020 | Config push timelines | STEP internship. A timeline of configuration changes, used by 2,000+ people a day. | /projects/barchart |
| 2019–20 | VEX library | Code for controlling a VEX competition robot. | GitHub |
| 2019 | Mobile robot 3D printing | AI4CE Lab. Small robots that worked together to print a floor plan. | /projects/3dprinting |
| 2018 | Started at NYU | Computer Science. | none |
| 2015 | Moved to the U.S. | High school, age sixteen. | none |
| 2018–21 | Coursework | Sudoku, BlueV, job-change prediction, two AI puzzles. | GitHub |

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

**Kicker:** Google Cloud · 2021 internship, plus follow-up work after joining full-time
**Headline:** Switching off a key without deleting it

**Context**
> Service account keys are like long-lasting passwords that software uses to sign in to Google Cloud. Until 2021, if you thought a key had leaked, the only fix was to delete it. Deleting a key breaks anything still using it, and you can't undo it.

**My role**
> As an intern in 2021, I designed and built a way to switch a key off and back on. I worked with four teams to add it everywhere customers manage their keys, and launched it to everyone. It's available to millions of users.
>
> After joining full-time, I built the feature that switches off a leaked key automatically. This is now on by default across Google Cloud.

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
| Dollar Dreadful credit | **Removed.** |
