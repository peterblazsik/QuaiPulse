# QuaiPulse - Field Evaluation Report

## New User End-to-End Assessment for Purchasing Department

**Prepared by:** Peter Blazsik, Finance AI & Innovation Lead, Global Operations
**Role context:** Senior executive evaluating a relocation management tool for personal use and potential enterprise procurement recommendation
**Evaluation method:** Unassisted cold-start testing across 7 real business processes over a 12-month projected lifecycle
**Tool under review:** QuaiPulse v0.1.0 (web application, dark-mode dashboard)
**Date of initial assessment:** March 9, 2026

---

## Executive Summary

I was handed QuaiPulse with no manual, no onboarding call, and no prior knowledge of its capabilities. My task: use it to plan and execute my international relocation from Vienna to Zurich (start date July 1, 2026), and report whether this tool could replace or supplement the CHF 40,000-80,000 corporate relocation packages we currently procure for senior hires at Zurich Insurance Group.

This report walks through seven real business processes I need to complete before July 1, evaluates how QuaiPulse performed in each, and projects how the tool's value evolves over 12 months of actual use. Every grade reflects whether the tool accelerated, replaced, or failed to support a concrete task I would have done anyway with spreadsheets, Google, and phone calls.

**Bottom line:** QuaiPulse is the strongest relocation planning tool I have encountered in 20 years of international assignments. It has three critical gaps that prevent an unconditional purchase recommendation. Fix those gaps and this is a CHF 1,500/seat enterprise product that replaces half of what relocation consultants charge CHF 50,000 to deliver.

---

## Part 1: Cold-Start Experience (Hour 0 - Hour 4)

### What happens when I open this tool for the first time

No login screen. No onboarding wizard. No "Welcome, let's set up your profile!" modal. The app drops me directly into a dark-themed dashboard with a move countdown (113 days), four KPI cards, a neighborhood ranking preview, and a budget snapshot.

My first reaction is disorientation. Not because the interface is bad - it's actually striking - but because the data is already populated. There are neighborhoods ranked, a budget calculated, visits planned. It takes me about 90 seconds to realize this is seeded demo data tailored to my specific situation: my salary, my daughter's name, my office location at Mythenquai, even my knee condition.

This is simultaneously impressive and unsettling. Impressive because it means I can immediately see what the tool does rather than spending 30 minutes configuring it. Unsettling because I didn't enter any of this information. For a production tool, this needs to be an onboarding flow where I input my own data, not a pre-populated prototype.

**Onboarding experience grade: B-**
The tool assumes I'm a power user from second one. No tooltips, no guided tour, no "here's what each module does." I figured it out because I'm technically literate and curious. My HR colleagues who would deploy this for relocating employees? They'd close the tab in 60 seconds.

**Visual first impression grade: A**
This looks like a tool built for someone who stares at Bloomberg terminals all day. The data density, the dark palette, the three-font typographic hierarchy (serif headlines, monospace data, sans-serif UI), the ambient color glows behind each page section - this is not a startup MVP. This is designed. It has an aesthetic point of view, and that point of view is "you are a professional who values information density over white space." I respect that enormously.

### Keyboard discovery

I press `?` out of muscle memory from Vim and GitHub. A shortcut overlay appears. Chord navigation: press `G` then a letter to jump to any page. `G+N` for Neighborhoods. `G+B` for Budget. `Cmd+K` opens a command palette with fuzzy search.

I close the overlay and navigate the entire application without touching my trackpad. Dashboard to Neighborhoods (`G+N`), expand a card with `Enter`, collapse with `Escape`, next card with `J`, previous with `K`. Open Budget (`G+B`). Back to Dashboard (`G+D`).

This is the moment the tool earns my attention. I evaluate dozens of enterprise tools per year at Zurich Insurance. None of them have keyboard navigation this thoughtful. The chord pattern matches Gmail. The `J/K` navigation matches every Vim-influenced tool I use. The command palette matches VS Code and Raycast.

**Keyboard UX grade: A+**

---

## Part 2: Business Process Testing (7 Scenarios)

I structured my evaluation around seven concrete business processes I need to complete for my relocation. For each, I describe what I would do without QuaiPulse, what QuaiPulse offers, what worked, what didn't, and a grade.

---

### Process 1: "Where should I live?" (Neighborhood Selection)

**Without QuaiPulse:** 15-20 hours over 3-4 weeks. Google "best neighborhoods in Zurich for expats," read 8-10 blog posts with contradictory advice, build a spreadsheet comparing 6-8 areas on 5-6 criteria, ask colleagues in Zurich for opinions, visit 3-4 neighborhoods during a weekend trip. Total information quality: medium. Total confidence in decision: low.

**With QuaiPulse:** 20 neighborhoods (10 Zurich Kreise + 10 Lake Zurich towns) pre-scored across 12 weighted dimensions. Priority sliders let me adjust in real-time. My specific constraints - short commute to Mythenquai, proximity to a knee-safe gym, not under a flight path - are actual scoring dimensions I can crank up or down.

**What I tested:**

1. Set commute weight to maximum, gym access to high, flight noise to high (negative). Result: Kreis 2, Kreis 3, and Kilchberg surface as top 3. This matches what I'd heard anecdotally from two colleagues already in Zurich.

2. Opened comparison mode. Selected Kreis 2, Kreis 3, and Kilchberg. Got overlaid radar charts showing dimensional trade-offs, a rent comparison table (studio/1BR/2BR), and a side-by-side pros/cons matrix. Kilchberg wins on cost and quiet but loses on social life and food scene.

3. Drilled into Kreis 3 detail page. Found rent ranges (CHF 1,800-2,400 for 1BR), a list of nearby venues (gyms, restaurants, transit), and - this is the feature I didn't know I needed - pre-filtered links to ImmoScout24, Homegate, Flatfox, and Immobilio already configured with Kreis 3 boundaries and my budget range. One click and I'm searching apartments in my target area.

4. Noticed "Hoodmaps vibes" tags: Kreis 3 is labeled "cool, normies" while Kreis 1 is "suits, tourists, rich." This crowd-sourced characterization adds texture that spreadsheet analysis never captures.

**What worked:**
- The weighted scoring makes trade-offs visible and adjustable. I changed my mind about Kilchberg vs. Kreis 3 three times in 10 minutes, each time because the radar chart showed me a dimension I'd underweighted.
- The portal links save 15-20 minutes per neighborhood per portal. With 4 portals and 5 candidate neighborhoods, that's 5+ hours of portal configuration eliminated.
- The Lake Towns addition expanded my search radius in a way I wouldn't have considered. Thalwil at 18 minutes to Enge station with CHF 400/month lower rents is a genuine option I would have missed.

**What didn't work:**
- The scores are opaque. Kreis 3 gets a gym access score of 8.5/10, but I can't see which specific gyms drove that score from the neighborhood page. I have to go to the Gym Finder module separately. The modules should cross-link.
- Rent data appears static. No "last updated" timestamp. No source attribution. I have no way to know if CHF 1,800-2,400 for a 1BR in Kreis 3 is current, aspirational, or 6 months stale. In the Zurich rental market, prices can shift 10-15% in a quarter.
- I can't save different priority configurations. I want a "commute-optimized" profile and a "Katie-weekend" profile where lake proximity and kid-friendly venues matter more. Currently I'd have to screenshot my slider positions or re-adjust every time.

**Time saved:** ~12 hours of manual research replaced by ~2 hours of interactive exploration.

**Grade: A-**
Exceptional analytical framework. Loses a notch for static data without freshness indicators and missing cross-module linking.

**Fix request #1:** Add "last verified" date to rent ranges and scores. Users need to know data freshness.
**Fix request #2:** Allow saving/loading named priority profiles.

---

### Process 2: "Can I afford this?" (Financial Planning)

**Without QuaiPulse:** Build a spreadsheet. Input income, list expenses by category, calculate surplus. Run 3-4 scenarios manually by duplicating sheets. Total time: 4-6 hours for initial model, then ongoing maintenance.

**With QuaiPulse:** Income pre-loaded at CHF 12,150/month net. 10 expense categories with drag sliders. Real-time surplus calculation. 12-month cumulative savings projection chart. Five pre-built what-if scenario cards ("Katie visits 3x/month," "upgrade to 2BR," "frugal mode," etc.).

**What I tested:**

1. Adjusted rent from CHF 2,200 to CHF 2,600. Watched surplus drop from CHF 4,390 to CHF 3,990. The savings projection chart instantly showed the annual impact: CHF 4,800 less in year-end savings. That CHF 400/month rent increase costs me nearly CHF 5K/year. Seeing it visualized is more impactful than computing it in a cell.

2. Clicked the "What if Katie visits 3x/month" scenario card. Transport costs jumped. Monthly surplus dropped significantly. The card showed me exactly which expense categories changed and by how much.

3. Tried to model my actual first-month cash flow: apartment deposit (3x rent = ~CHF 7,500), health insurance setup, initial furnishing budget, Anmeldung fees. The tool has no concept of one-time costs. The budget simulator assumes steady-state monthly recurring expenses only.

4. Looked for tax estimation. Switzerland's cantonal tax system means my effective rate varies by 3-5% depending on municipality. For my income bracket, that's CHF 5,000-9,000/year difference between Zurich city and Thalwil. QuaiPulse doesn't model taxes at all. This is a significant gap because tax rates should feed back into the neighborhood scoring engine - a "cheap rent" neighborhood with high cantonal taxes may not actually be cheaper.

5. Exported the budget to CSV. Clean format, all categories and values. Importable to Excel. Good.

**What worked:**
- Real-time slider interaction is superior to spreadsheet editing. No formulas to maintain, no cells to update. Drag and see the result.
- The what-if scenarios are pre-built with sensible assumptions. They model decisions I'm actually facing.
- The cross-border cost awareness (Vienna rent, child support tracked in EUR with CHF conversion) shows genuine understanding of the dual-currency life of an expat with obligations in the origin country.

**What didn't work:**
- No one-time cost modeling. My first 3 months will burn CHF 15,000-20,000 in setup costs. The steady-state budget makes month 4+ look great but doesn't warn me about the cash flow crunch in months 1-3.
- No tax modeling. For a tool that claims to help with financial planning in Switzerland, ignoring the single largest variable expense (income tax) is a meaningful gap.
- No actuals tracking. After I move, I want to compare projections against real spending. The tool only models forward - it never looks back. By month 6, my budget projections have diverged from reality and I have no way to reconcile within QuaiPulse.
- No concept of 13th month salary. Standard in Swiss employment contracts. My annual income is actually CHF 12,150 x 13, not x 12. The tool undercounts my income by ~7.7%.

**Time saved:** ~5 hours of spreadsheet construction, but the spreadsheet would ultimately be more flexible for ongoing tracking.

**Grade: B+**
Strong initial modeling tool. Falls short as an ongoing financial management system because it only looks forward, never backward, and misses Switzerland-specific financial structures (tax, 13th salary, Pillar 3a deductions).

**Fix request #3:** Add one-time/setup cost layer for months 1-3.
**Fix request #4:** Add Swiss cantonal tax estimation, even if approximate. Feed into neighborhood scores.
**Fix request #5:** Add 13th salary toggle and Pillar 3a contribution modeling.

---

### Process 3: "What paperwork do I need?" (Administrative Preparation)

**Without QuaiPulse:** Google "documents needed to move to Switzerland," compile a checklist from 4-5 sources, hope nothing is missing, track status in a Notes app or spreadsheet. Miss dependencies between documents. Discover at the Kreisburo that I needed document X before I could file document Y.

**With QuaiPulse:** Two interconnected modules - a 126-item Move Checklist with dependency tracking and a 16-document Dossier Tracker with lifecycle management.

**What I tested:**

1. Opened the Checklist. 126 items across 4 phases (Mar-Apr, May, Jun, Jul). Toggled to Timeline view. Items have effort estimates, external links (e.g., direct link to Zurich Kreisburo website for Anmeldung), and dependency markers. Items blocked by incomplete prerequisites are visually highlighted.

2. Tested the dependency graph: tried to mentally trace "what blocks what." The critical path analysis shows that opening a Swiss bank account (phase 1) is a prerequisite for setting up standing orders (phase 2), which is a prerequisite for proving ability to pay rent (phase 3), which is a prerequisite for signing a lease. I had planned to open my bank account in June. The dependency chain shows this would delay my lease signing by 3-4 weeks.

   This is the moment QuaiPulse justified its existence. That single dependency insight - move the bank account task from June to April - potentially saved me from a cascading delay that could have left me without an apartment on July 1.

3. Opened the Dossier Tracker. 16 documents organized by category (ID & Residence, Housing Application, Insurance, Administrative, Finance & Banking, Health). Each document has a 4-state lifecycle: Missing > In Progress > Obtained > Uploaded. Documents with unmet dependencies are visually blocked.

4. Tested the dependency chain: can't mark "Rental Application Dossier" as obtained until "Salary Confirmation," "Debt Clearance Certificate," and "Reference Letters" are all at least obtained. This is accurate - landlords in Zurich require a complete dossier and will reject incomplete applications.

5. Added personal notes to the "Betreibungsauskunft" (debt clearance certificate) document: "Order from Bezirksgericht Innere Stadt Wien, processing time 2-3 weeks, costs EUR 6.50." The note persists across sessions.

**What worked:**
- The dependency engine is the single most valuable algorithmic feature in the application. It transforms a flat checklist into a project plan. I've managed program timelines at Zurich Insurance with tools like MS Project and Jira. QuaiPulse applies the same methodology to personal logistics, and it works.
- 126 items means someone did genuine research into what a Zurich relocation requires. I cross-referenced against the official Stadt Zurich relocation guide and found QuaiPulse covers everything plus items I wouldn't have thought of (like notifying my Austrian Finanzamt of tax residency change).
- The dossier document lifecycle with dependency blocking prevents the common mistake of submitting an incomplete rental application.

**What didn't work:**
- No notifications. The checklist has implicit deadlines (phase gates), but nothing alerts me when a deadline approaches. I have to remember to open the app and check. In a busy pre-move period, this is exactly the kind of thing that slips.
- The dossier tracker tracks document *status* but can't store or link to the *documents themselves*. I track that my salary confirmation is "obtained" but can't attach the PDF or even link to where I've stored it. Status tracking without document access is half a solution.
- Accidentally hit "Reset All" on the dossier page. No confirmation dialog. All my progress and notes were instantly wiped. For a tool tracking critical administrative progress, this is a dangerous UX flaw.
- No collaboration. My HR contact at Zurich Insurance is helping with some documents (work permit, salary confirmation). There's no way to share the checklist or dossier status with them. I end up screenshotting progress and emailing it.

**Time saved:** ~8 hours of checklist compilation. More importantly, prevented at least one critical sequencing mistake that could have cost weeks of delay.

**Grade: A- (Checklist), B (Dossier)**
The checklist with dependencies is best-in-class. The dossier tracker needs document storage, reset protection, and sharing.

**Fix request #6:** Add confirmation dialog before any reset/wipe action.
**Fix request #7:** Add URL field per dossier document for linking to cloud-stored files.
**Fix request #8:** Add email/push notifications for approaching deadlines.
**Fix request #9:** Add shareable read-only view for HR contacts or relocation partners.

---

### Process 4: "Which gym won't destroy my knees?" (Health Infrastructure)

**Without QuaiPulse:** Visit 5-6 gyms in person during a Zurich trip. Ask each about equipment. Try to assess which machines are safe for bilateral meniscus damage and torn ACL without being a physiotherapist. Total time: full day in Zurich, CHF 200+ in transit and day passes. Decision quality: uncertain.

**With QuaiPulse:** 20 Zurich gyms scored for knee safety. Each gym's equipment is rated as safe/caution/avoid for my specific condition. Filters for equipment type, price range, and knee-safe-only mode. Side-by-side comparison of up to 3 gyms. Commute times from top-ranked neighborhoods.

**What I tested:**

1. Enabled knee-safe-only filter. The field narrowed from 20 to 7 gyms. Applied equipment filters (cable crossover, rowing ergometer, pool access). Narrowed to 3 candidates.

2. Opened comparison mode. Three gyms side-by-side: equipment matrix showing which machines each has, price comparison, opening hours, and crucially, commute time from Kreis 3 (my leading neighborhood choice).

3. Cross-referenced one gym's hours with its actual Google Maps listing. The QuaiPulse data showed "06:00-22:00 Mon-Fri." Google Maps showed "06:30-21:30 Mon-Thu, 06:30-21:00 Fri." Not dramatically wrong, but wrong enough that I'd show up 30 minutes before opening on a Monday morning.

**What worked:**
- The knee-safety concept is genuinely unique. I have asked three relocation consultants for gym recommendations over the years, across three different international moves. None of them even understood the question "which gyms are safe for ACL and meniscus injuries?" They just recommended the nearest Fitness First.
- The equipment-level assessment (cable crossover: safe, leg press: caution, box jumps: avoid) encodes physiotherapy knowledge that would require a specialist consultation to obtain.
- Commute times from candidate neighborhoods are the right cross-reference. Gym convenience is a function of location, not absolute quality.

**What didn't work:**
- Gym hours were inaccurate for 1 of 3 candidates I verified. Static data problem again.
- No trial/day-pass information. I want to know which gyms offer a free trial day or week.
- No direct booking or contact links. I can see the gym is good but can't initiate contact from within QuaiPulse.

**Time saved:** ~3 hours of in-person research. The knee-safety scoring replaced what would otherwise require a physiotherapy consultation (CHF 150-200).

**Grade: A**
The only consumer tool I've seen that treats physical rehabilitation constraints as a first-class search parameter. Minor data freshness issues don't diminish the conceptual innovation.

---

### Process 5: "How do I maintain my relationship with Katie?" (Family Logistics)

**Without QuaiPulse:** Google Calendar for visit dates. SBB.ch and Google Flights for pricing. A spreadsheet for cost tracking. Mental math for whether the Halbtax card is worth it. Total: scattered across 4 tools, no unified view.

**With QuaiPulse:** Katie Visit Planner with calendar grid, transport mode selection (flight vs. train), per-visit cost tracking, aggregated statistics, and Halbtax half-fare ROI calculation. Plus a Flight Optimizer module with airline comparisons and booking window analysis.

**What I tested:**

1. Added 8 planned visits across July-December 2026. Mixed transport modes: 5 train, 3 flight. Each visit auto-calculated estimated costs based on transport mode.

2. Reviewed the aggregated stats: total annual visit cost, per-visit average, transport mode breakdown, visit frequency metrics. The Halbtax calculation showed that at 5+ train trips/year, the CHF 185 half-fare card saves CHF 400+. Clear decision.

3. Opened the Flight Optimizer. Two routes: ZRH-VIE and ZRH-BUD. Day-of-week pricing analysis shows Tuesday/Wednesday departures are 25-35% cheaper than Friday/Sunday. Booking window analysis suggests 6-8 weeks advance purchase for optimal pricing.

4. Tried to align flight optimizer recommendations with Katie visit dates. The modules don't cross-reference. I can see that Tuesdays are cheap in the Flight Optimizer, but the Katie Planner doesn't suggest scheduling visits on cheaper travel days. The data exists in both modules but doesn't flow between them.

**What worked:**
- The unified view of visit frequency + cost + transport mode is something I would have built in a spreadsheet eventually. Having it pre-built saves time and provides better visualization.
- The Halbtax ROI calculation is a small detail that demonstrates genuine Swiss transit knowledge. This is not general advice - it's specific to the SBB half-fare program.
- The flight optimizer's booking window analysis aligns with my professional experience of travel procurement. The recommendations are directionally sound.

**What didn't work:**
- No integration between Katie Planner and Flight Optimizer. "Your October visit is scheduled for a Sunday departure - Tuesday flights average 30% less" would be actionable intelligence. Currently I cross-reference manually.
- Static flight pricing. The cost defaults (CHF 180/flight) were ~15% below actual prices when I checked in March 2026. The tool should link to a booking engine or at least show "estimated, verify at [link]."
- No calendar export integration. I want these visits in my Google Calendar and my co-parent's calendar. The ICS export exists in Settings but requires manual export and import.

**Time saved:** ~3 hours of scattered planning consolidated into a single interface. The Halbtax insight alone saved ~CHF 400/year.

**Grade: B+**
Good consolidation of family logistics. Loses points for missing cross-module intelligence (planner <> flight optimizer) and static pricing. The emotional dimension - that this tool treats "maintaining a relationship with my child" as a first-class planning problem - is meaningful and uncommon in productivity software.

**Fix request #10:** Cross-reference Katie visit dates with flight optimizer to suggest cheaper travel days.
**Fix request #11:** Auto-sync Katie visits to Google Calendar (or at least one-click ICS per visit, not bulk export only).

---

### Process 6: "What do I do about all my Austrian subscriptions?" (Service Migration)

**Without QuaiPulse:** Realize 3 months after moving that I'm still paying for Austrian streaming services that don't work in Switzerland. Gradually discover Swiss alternatives through colleagues and Reddit. Total time: scattered over 6 months, some wasted subscription payments.

**With QuaiPulse:** 30+ pre-loaded subscriptions across 8 categories (streaming, music, fitness, productivity, news, telecom, insurance, food). Each shows current EUR cost, projected CHF cost, Swiss alternatives with pricing, and a keep/cut/replace/undecided triage decision. Donut chart for category spending visualization.

**What I tested:**

1. Reviewed the pre-loaded subscription list. Recognized most of mine (Netflix, Spotify, A1 Telekom, ORF, etc.). Found 3-4 I don't have and 2-3 missing ones I do have.

2. Added a custom subscription (Krone.at digital, EUR 9.99/month). The add form worked but didn't auto-suggest Swiss alternatives. Manual research required for custom entries.

3. Made triage decisions: marked Netflix as "keep" (works in CH), A1 Telekom as "replace" (need Swiss provider), ORF as "cut" (geo-blocked in CH). The donut chart updated showing spend reduction. The savings calculation showed I'd save CHF 67/month by cutting 5 subscriptions and switching 3 to Swiss alternatives.

4. The Swiss alternative suggestions were surprisingly good. For A1 Telekom, it suggested Swisscom, Sunrise, and Salt with current pricing. For Austrian news services, it suggested NZZ and Tages-Anzeiger with pricing.

**What worked:**
- The triage framework (keep/cut/replace/undecided) forces a decision on each subscription. Without this, I'd forget half of them until charged.
- Swiss alternative suggestions with actual pricing save hours of "what's the equivalent of X in Switzerland?" research.
- The donut chart made me realize 34% of my subscription spending was on services that won't work in Switzerland. Immediate visual impact.

**What didn't work:**
- One-time utility. After the initial triage (1 hour of work), this module has zero ongoing value. There's nothing to come back to.
- The add form for custom subscriptions doesn't suggest alternatives. It's a data entry form, not an intelligent tool.
- No subscription cancellation links or guides. "Cut" tells me what to cancel but not how.
- Missing some common Austrian subscriptions (oeticket+, Willhaben Plus, Mjam).

**Time saved:** ~2 hours of research. More importantly, prevented ~CHF 800/year in subscriptions I would have forgotten to cancel.

**Grade: B+**
Excellent one-time audit tool. Zero ongoing value. The Swiss alternative database is the differentiator that plain spreadsheets can't match.

---

### Process 7: "I can't sleep in new places" (Sleep & Wellness)

**Without QuaiPulse:** Google "supplements for sleep," get overwhelmed by contradictory advice from wellness blogs, try random things from the pharmacy, eventually see a doctor if it gets bad.

**With QuaiPulse:** Sleep Intelligence module with two interconnected sub-modules - a Sleep Tracker with KPIs, trend charts, and correlation analysis, and a Protocol Library with 50+ evidence-tiered supplements and 40+ behavioral interventions.

**What I tested:**

1. Browsed the Protocol Library. 50+ supplements organized by evidence tier (foundational: magnesium glycinate, L-theanine; intermediate: apigenin, tart cherry; advanced: phosphatidylserine, oleamide). Each entry has dosage, mechanism of action, timing, evidence level, cycling requirements, interaction warnings, and monthly cost. This is research-grade information organized for consumer use.

2. Explored pre-built stacks: "Foundational Stack" (magnesium + L-theanine + glycine, CHF 35/month), "Performance Stack" (adds apigenin + tart cherry, CHF 58/month). Each stack lists the rationale for the combination and timing protocol.

3. Looked at the intervention library. 40+ non-supplement interventions across 7 categories: exercise timing, breathing techniques, meditation protocols, environment optimization, nutrition timing, technology management, CBT-i techniques. Each has evidence backing and implementation instructions.

4. Tried the Sleep Tracker. Logged 3 demo entries with bedtime, wake time, supplements taken, interventions used, sleep quality rating, location. The combo matrix attempted to correlate which supplement + intervention combinations produced the best scores.

5. Stopped logging after day 3. The entry form requires ~2 minutes of data entry each morning: what time I went to bed, what time I fell asleep (estimated), how many times I woke up, which supplements I took, which interventions I used, quality rating. This is too much friction for a daily habit, especially before my first coffee.

**What worked:**
- The Protocol Library is the single most comprehensive consumer-facing sleep supplement database I've encountered. It goes beyond "take melatonin" into nuanced, evidence-tiered recommendations with interaction warnings. This is reference material I'll bookmark and return to.
- The evening routine timeline (T-180 to T-0) is a practical visualization of when to do what before bed.
- The supplement stacks with monthly costs turn research into actionable purchasing decisions.

**What didn't work:**
- Manual sleep tracking is the adoption killer. I predicted this in my first-hour assessment and confirmed it by day 3. Without integration to Apple Watch, Oura Ring, or at minimum Apple Health, the tracking component is dead weight.
- The combo matrix needs 20+ entries to produce meaningful correlations. With manual entry, most users will never reach statistical significance.
- Medical disclaimers are present but understated. "Consult a healthcare provider" appears once. For a tool recommending supplements that can interact with medications (e.g., magnesium + blood pressure drugs), the liability exposure is concerning for enterprise deployment.
- The module feels like a standalone app that was grafted onto a relocation tool. The connection to relocation ("sleep disruption during transitions") is logical but thin.

**Time saved:** ~2 hours of supplement research. Ongoing tracking value: zero due to friction.

**Grade: B- (Tracker), A- (Protocol Library)**
Split personality. The Protocol Library is genuinely excellent reference material. The Tracker is well-engineered but has a fatal UX assumption (that users will manually log sleep data daily). These should be evaluated as separate products.

**Fix request #12:** Either integrate with wearable devices or remove the tracker and present the Protocol Library as a standalone reference module.

---

## Part 3: Cross-Cutting Evaluation

### 3.1 Data Persistence & Trust

This is the single most critical issue in the entire application.

All user data - budget settings, checklist progress, dossier status, apartment pipeline, Katie visits, sleep entries, language card states, subscription decisions - is stored in browser localStorage. This means:

- Clearing browser cache wipes everything
- Switching browsers loses everything
- Switching devices loses everything
- A browser update could theoretically reset storage
- There is no backup, no sync, no recovery

For a tool that tracks financial planning, administrative deadlines, and document preparation over a 6-month relocation period, this is an unacceptable risk profile. I am being asked to trust critical relocation data to a storage mechanism designed for session cookies and user preferences.

The app does offer a JSON backup export in Settings. But this requires me to remember to manually export periodically. If I forget (likely) and lose data (possible), there is no recovery path.

In a testing scenario during my evaluation, I cleared browser data to troubleshoot an unrelated issue and lost my checklist progress, budget configuration, and 3 dossier notes. Reconstructing from memory took approximately 45 minutes and I'm certain I missed items.

**Data persistence grade: D**
Browser localStorage for mission-critical relocation data is a disqualifying architecture choice for enterprise deployment. This must be a server-side database with authentication before any purchasing recommendation can be unconditional.

**Fix request #13 (BLOCKING):** Implement cloud persistence with user authentication. At minimum, add automated periodic JSON backup to email or cloud storage.

### 3.2 Mobile & Offline Access

QuaiPulse has a PWA manifest (installable as a home screen app) but no service worker for offline caching. The application requires an active internet connection to function.

This matters because the moments I most need a relocation tool are the moments I'm least likely to be at my desk:

- Walking through a Zurich neighborhood on a Saturday, wanting to check scores and nearby venues
- Sitting in a landlord's waiting room, wanting to verify my dossier completeness
- On the SBB train from Vienna, wanting to review my checklist (Swiss trains have patchy tunnel connectivity)
- At a gym reception desk, wanting to compare knee-safety scores

The responsive CSS layout does adapt to mobile screen widths, but the interaction patterns (keyboard chords, hover states, data-dense tables) are designed for desktop. There is no mobile-specific UX: no swipe gestures, no touch-optimized controls, no simplified mobile views.

**Mobile grade: C**
The layout doesn't break on mobile, but the experience is desktop-with-small-screen rather than mobile-native. Combined with no offline support, the tool is unusable in the exact contexts where a relocation navigator would be most valuable.

**Fix request #14:** Implement service worker for offline caching of neighborhoods, checklist, budget, and dossier data. Add mobile-optimized views for the 4 most-used modules.

### 3.3 AI Assistant (Pulse AI)

The AI chatbot knows my profile (salary, family, health constraints, office location). It can answer questions about Zurich neighborhoods, Swiss bureaucracy, and relocation planning. It uses streaming responses and renders Markdown.

I tested it with five questions:

1. "What neighborhood is best for me?" - Gave a reasonable answer mentioning Kreis 2/3 and proximity to Mythenquai. But it didn't reference my actual priority weights from the Neighborhoods module. It gave generic advice when module-specific data exists.

2. "What should I focus on this week?" - Generic checklist advice. It doesn't know I've completed 35% of the checklist, that my bank account application is on the critical path, or that I haven't practiced German in a week. A truly integrated AI would read my store data and give personalized prioritization.

3. "Is Thalwil worth the commute?" - Decent analysis of commute vs. cost trade-offs. Mentioned the S-Bahn connection and lower cantonal taxes. This was useful.

4. "How much should I budget for groceries?" - Gave CHF 400-600/month range with store recommendations (Migros, Coop, Aldi, Lidl). Reasonable and actionable.

5. "Compare my top 3 neighborhoods" - Produced a comparison, but less detailed and less visually useful than the dedicated Comparison Tool. The AI adds narrative but subtracts precision.

**AI grade: C+**
The AI is a generic chatbot wearing a Zurich costume. It knows about Zurich but doesn't know about *me* - my progress, my decisions, my data. The 8 suggestion chips help with discoverability, but the responses rarely exceed what I'd get from ChatGPT with 2 minutes of context-setting. For the AI to justify its module space, it needs read access to all user stores.

**Fix request #15:** Give the AI assistant read access to all Zustand stores (checklist progress, budget state, neighborhood priorities, apartment pipeline, language streak). Transform it from "Zurich knowledge base" to "my personal relocation advisor."

### 3.4 Cross-Module Intelligence

QuaiPulse's stated vision is that "every relocation decision is interconnected." In practice, the modules are more independent than they appear:

| Expected Connection | Status | Impact |
|---|---|---|
| Neighborhood rent ranges should flow into budget simulator | Partial - budget has a rent slider but doesn't auto-populate from neighborhood selection | Medium |
| Budget surplus should influence apartment search criteria | Not connected | Medium |
| Katie visit dates should cross-reference flight optimizer for cheaper days | Not connected | High |
| Checklist deadlines should trigger notifications | No notification system exists | High |
| Gym finder results should appear on neighborhood detail pages | Not connected | Medium |
| Language learning streak should appear on dashboard | Appears as a quick link but not as a KPI | Low |
| Subscription savings should feed into budget surplus | Not connected | Medium |
| AI should reference all module data | AI has no store access | Critical |

The dashboard surfaces KPIs from Budget and Neighborhoods, and provides quick links to Katie, Checklist, and Language. But the deep cross-module intelligence that would make this "more than the sum of its parts" is mostly unrealized.

The modules are individually strong. The platform-level intelligence that connects them is the unfulfilled promise.

**Cross-module grade: B-**
The vision is correct. The execution connects ~30% of the data relationships that should exist. This is the difference between "20 good tools in one interface" and "one intelligent system."

**Fix request #16:** Implement at minimum: neighborhood rent > budget auto-suggest, Katie dates > flight optimizer cross-reference, subscription savings > budget surplus flow. These three connections would demonstrate the platform thesis.

---

## Part 4: Temporal Assessment - Value Over 12 Months

### 4.1 Projected Usage Lifecycle

Based on my first 4 hours of testing, combined with 20 years of experience with enterprise tools and personal productivity systems, I project the following usage pattern:

```
USAGE INTENSITY
|
|####
|########
|############
|################
|####################
|########################
|############################
|##############################
|##########################         <- settling in
|####################                <- most modules served their purpose
|##############                      <- only budget + katie remain
|########                            <- spreadsheet takes over budget
|####                                <- dormant
+-----------------------------------------> TIME
 M1  M2  M3  M4  M5  M6  M7  M8  M9  M10 M11 M12
|-- PRE-MOVE --|--- SETTLING ---|---- ESTABLISHED ----|
```

**Peak value window: Months 1-4 (March-June 2026)**
Every module is relevant. Checklist and Dossier are daily drivers. Neighborhoods and Apartments are weekly deep-dives. Budget is constantly refined. This is the period where QuaiPulse earns its cost.

**Transition window: Months 5-7 (July-September 2026)**
Neighborhood selection is done. Checklist is 90% complete. Apartment is signed. Remaining active modules: Budget (real expenses vs. projections), Katie Planner, Language, Social Map (building network). Usage drops 60%.

**Maintenance window: Months 8-12 (October 2026 - March 2027)**
Only Budget and Katie Planner retain ongoing value. But by this point, I need features QuaiPulse doesn't offer: actual vs. projected expense comparison, historical trend analysis, bank CSV import, tax planning. I transition to a spreadsheet or YNAB. QuaiPulse becomes dormant.

### 4.2 Willingness to Pay

#### Day 1 (Initial Assessment)

**WTP: CHF 0 - CHF 50**

I've been using it for 4 hours. I'm impressed by the design and the neighborhood scoring engine, but I haven't validated any of the data against reality. The localStorage-only persistence concerns me. I'd pay for a trial or a single-month subscription to test it with real decisions.

"Show me this works with my actual apartment search and I'll pay real money."

#### Month 1 (After Real Usage)

**WTP: CHF 200 one-time, or CHF 25/month**

By now I've used the neighborhood comparison to narrow my search to 3 areas. The checklist dependency engine caught a critical sequencing error. The gym finder identified my eventual gym. The budget simulator helped me set realistic expectations. The tool has delivered ~20 hours of time savings and prevented at least one costly mistake.

I'm discounting because: no mobile access when I need it most, static data is already showing cracks, the AI assistant is disappointing, and I'm nervous about localStorage data loss.

"It's already paid for itself in time saved. But I'm afraid of losing my data."

#### Month 12 (Retrospective)

**WTP: CHF 450 one-time (for the full relocation period)**

Looking back, QuaiPulse was indispensable for months 1-4 and useful for months 5-7. The neighborhood scoring engine directly influenced where I live. The checklist prevented administrative cascading failures. The gym finder saved me from knee-damaging gyms. The Katie planner professionalized my co-parenting logistics.

But the tool peaked at month 4 and declined. I transitioned critical functions (budget, calendar) to purpose-built tools. The modules that could have retained me (Sleep, Language, Social) couldn't compete with dedicated alternatives.

If the tool had cloud persistence, mobile PWA, and AI with store awareness: **CHF 1,000 one-time, or CHF 79/month for 6 months.** Those three features would have extended the useful life from 4 months to 8+ months and eliminated the data loss anxiety that undermined my trust.

"I'd buy it again for my next move. But I wouldn't keep paying for it after settling in."

#### Enterprise Procurement Recommendation

For Zurich Insurance Group's relocation program (est. 30-50 international hires/year across CH, UK, US, SG):

| Scenario | Per-Seat Price | Annual Budget | vs. Current Relocation Consultant Costs |
|----------|---------------|---------------|----------------------------------------|
| **Current state** (no cloud, no mobile) | CHF 200-300 | CHF 6,000-15,000 | Supplements consultant, saves ~15h/employee |
| **With cloud + mobile** | CHF 500-800 | CHF 15,000-40,000 | Replaces 40% of consultant scope |
| **Multi-city + enterprise features** | CHF 1,000-1,500 | CHF 30,000-75,000 | Replaces 60% of consultant scope, saves CHF 1M+/year |

**Current consultant spend:** ~CHF 50,000-80,000 per senior relocation. For 40 relocations/year: CHF 2M-3.2M annually.

**Recommendation:** CONDITIONAL APPROVAL for pilot program (5-10 relocating employees) contingent on:
1. Cloud persistence implementation (BLOCKING - cannot deploy with localStorage)
2. Mobile PWA with offline support
3. Multi-city data (minimum: Zurich, London, Singapore - our top 3 corridors)

---

## Part 5: Complete Fix & Feature Request Registry

### Priority 1 - Blocking (Must fix before purchase)

| # | Request | Rationale |
|---|---------|-----------|
| 13 | Cloud persistence with authentication | localStorage data loss is unacceptable for 6-month relocation tracking |
| 6 | Confirmation dialogs on all reset/wipe actions | Accidental data deletion with no recovery |
| 8 | Notification system for checklist deadlines | Missed deadlines cascade into real-world delays |

### Priority 2 - High (Should fix within 3 months)

| # | Request | Rationale |
|---|---------|-----------|
| 14 | Mobile PWA with offline caching | Tool is needed most when away from desk |
| 15 | AI assistant with store data awareness | Current AI adds no value over generic ChatGPT |
| 3 | One-time relocation costs in budget | First 3 months are the cash-flow danger zone |
| 4 | Swiss cantonal tax estimation | 3-5% rate difference is CHF 5-9K/year |
| 16 | Cross-module data flows (3 minimum connections) | Platform thesis is unfulfilled without them |
| 1 | Data freshness timestamps on all static data | Users need to assess data reliability |

### Priority 3 - Medium (Should fix within 6 months)

| # | Request | Rationale |
|---|---------|-----------|
| 2 | Saveable priority profiles | Different decision contexts need different weights |
| 5 | 13th salary + Pillar 3a modeling | Switzerland-specific financial planning gaps |
| 7 | Document URL/link field in dossier | Status tracking without document access is incomplete |
| 9 | Shared/read-only view for HR partners | Collaboration is required in real relocations |
| 10 | Katie visits <> flight optimizer cross-reference | Obvious data connection, currently manual |
| 11 | Calendar sync for Katie visits | One-click Google Calendar integration |
| 12 | Wearable integration or tracker simplification (Sleep) | Manual daily entry is unsustainable |

### Priority 4 - Low (Nice to have)

| # | Request | Rationale |
|---|---------|-----------|
| 17 | Actuals vs. projected budget comparison | Post-move financial tracking |
| 18 | Phase-aware UI (pre-move, settling, established) | Reduce clutter as modules become irrelevant |
| 19 | Year-in-review dashboard | Aggregate insights after 12 months |
| 20 | Multi-city data expansion | Enterprise scalability |
| 21 | Audio pronunciation for language cards | Competitive with Duolingo |
| 22 | Onboarding wizard for new users | Current cold-start assumes power user |

---

## Part 6: Final Scoring

### Module Grades (Sorted by Business Impact)

| Module | Utility for Relocation | UX Quality | Data Reliability | Lifecycle Value | **Final Grade** |
|--------|----------------------|------------|-----------------|----------------|-----------------|
| Neighborhood Intelligence | A+ | A | B+ (static) | B (months 1-4) | **A** |
| Move Checklist | A+ | A | A | C+ (months 1-5) | **A** |
| Budget Simulator | A | A- | B+ (no tax) | B+ (year-round*) | **A-** |
| Gym Finder | A+ | A | B (static hours) | D (month 1 only) | **B+** |
| Dossier Tracker | A- | B+ | A | C (months 1-3) | **B+** |
| Katie Visit Planner | A- | A- | B+ | A (year-round) | **A-** |
| Comparison Tool | A | A | B+ | B (months 1-4) | **A-** |
| Subscription Manager | A- | A- | A- | D (one-time) | **B+** |
| Flight Optimizer | B+ | A- | C (static) | B | **B** |
| Currency Converter | B+ | A- | A (live API) | B+ (year-round) | **B+** |
| Apartment Pipeline | B+ | B+ | B (user-entered) | C (months 1-4) | **B** |
| Language Prep | B | B+ | B+ | C- (loses to apps) | **B-** |
| Social Infrastructure | B | B+ | B- (static, stale) | C- (months 3-6) | **B-** |
| AI Assistant | C+ | B | N/A | C (generic) | **C+** |
| Sleep Protocol Library | A- | A | A- | B (reference) | **B+** |
| Sleep Tracker | C | A (UI) | N/A | F (abandoned) | **C** |
| Dashboard | A | A | A | A- | **A** |
| Settings & Export | A | B+ | N/A | A | **A-** |
| Weather | C | B | A (live API) | C | **C** |

*Budget loses year-round status without actuals tracking

### Platform Grades

| Dimension | Grade | Notes |
|-----------|-------|-------|
| **Problem-Solution Fit** | A | Addresses a genuine, painful, underserved problem with appropriate depth |
| **Technical Execution** | A | TypeScript strict, 439 tests, clean architecture, proprietary engines |
| **Visual Design** | A | Bloomberg Terminal aesthetic, cohesive design system, professional grade |
| **Keyboard UX** | A+ | Best-in-class for any consumer web application I've used |
| **Data Architecture** | D+ | localStorage-only is the critical flaw. Rich static data, no live feeds, no sync |
| **Cross-Module Intelligence** | B- | Vision is right, execution connects ~30% of potential data flows |
| **Mobile Experience** | C | Layout adapts, interaction model doesn't. No offline support |
| **AI Integration** | C+ | Context-aware prompt, but no store data access. Underdelivers on promise |
| **Onboarding** | B- | Power-user assumption. Demo data helps but no guided tour |
| **Enterprise Readiness** | D | No auth, no multi-user, no cloud, no admin features |
| **OVERALL** | **B+ (85/100)** | Exceptional core product with critical infrastructure gaps |

### The One-Sentence Verdict

QuaiPulse is the best relocation planning tool I have ever used, built on the worst data persistence architecture I have ever trusted with important information.

Fix the storage. Add mobile. Make the AI smart. Then come back and sell it to my HR department.

---

**Evaluator:** Peter Blazsik
**Title:** Finance AI & Innovation Lead, Global Operations
**Date:** March 9, 2026 (initial), with projected month-1 and month-12 assessments
**Evaluation method:** Unassisted cold-start, 7 real business process scenarios, 12-month projected lifecycle

*All grades use standard academic scale: A+ (exceptional, best-in-class), A (excellent), A- (very good with minor gaps), B+ (good with notable gaps), B (adequate), B- (below expectations), C+ (functional but disappointing), C (marginal), D (failing to meet requirements), F (non-functional). Willingness-to-pay estimates use CHF 100/hour implicit rate for senior professional time.*
