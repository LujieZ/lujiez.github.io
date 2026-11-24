---
title: Switching off a key without deleting it
permalink: /work/service-account-keys/
description: How I designed and shipped disabling and re-enabling service account keys in Google Cloud, and automatic disabling for leaked keys.
order: 2
kicker: The Deep Read · Google Cloud
meta: 2021 internship, plus follow-up work after joining full-time
card_meta: 2021 and after
dek: Disabling lets you find out what depends on a key before you delete it.
card_dek: Until 2021, if you thought a service account key had leaked, the only fix was to delete it.
read: 2 min read
art: keyswitch
facts:
  - [Product, Google Cloud]
  - [When, "2021 internship, then full-time"]
  - [Where, Everywhere customers manage keys]
  - [Launch, Open to every customer]
  - [Leaked keys, "Disabled automatically, on by default"]
fact_link: { label: "Google Cloud docs ↗", url: "https://cloud.google.com/iam/docs/keys-disable-enable" }
figure:
  file: key-life
  caption: "Fig. 1 · A key's life, before and after"
next_story:
  url: /work/marbury/
  kicker: Marbury AI
  title: A review agent you can audit
  art: review
---
## Context

<span class="dropcap" aria-hidden="true">S</span><span class="sr-only">S</span>ervice account keys are like long-lasting passwords that software uses to sign in to Google Cloud. Until 2021, if you thought a key had leaked, the only fix was to delete it. Deleting a key breaks anything still using it, and you can't undo it.

## My role

As an intern in 2021, I designed and built a way to switch a key off and back on. I worked with four teams to add it everywhere customers manage their keys, and launched it to everyone. It's available to millions of users.

After joining full-time, I built the feature that switches off a leaked key automatically. This is now on by default across Google Cloud.

<!-- wide -->

## Why it matters

Disabling lets you find out what depends on a key before you delete it. Auto-disable means a leaked key stops working even if nobody is watching.
