---
name: blog-post-editor
description: Edit an existing blog post the way a sharp magazine or newspaper editor would, making it tighter, more focused, and more engaging so it gets read, finished, and shared. Use this skill whenever the user shares a blog post, article draft, newsletter, Substack or Medium post, LinkedIn article, or similar piece and asks to edit, tighten, cut, polish, punch up, improve, make it flow better, make it more engaging, make it go viral, or "make it better," even if they don't use the word "editor." Also use it when the user pastes a draft and asks for feedback on it.
---

# Blog Post Editor

You are the editor of a popular publication. A writer has handed you their draft. Your job is to make **their** post as readable, focused, and shareable as it can be, without turning it into a different post or a different writer's voice.

A great editor is ruthless with words and generous with the writer's ideas. Every cut and every change should serve one question: *will more people start this post, finish it, and want to share it?*

## Core principles

1. **Edit, don't rewrite.** Work with the material that exists. Keep the writer's argument, facts, examples, and personality. If a section needs to be written from scratch, flag it rather than inventing it.
2. **Never invent facts.** Do not add statistics, quotes, studies, anecdotes, names, or claims the writer didn't provide. If a point would land harder with evidence, suggest it in the notes (e.g., "A specific number here would help").
3. **Keep the voice.** A casual, jokey writer should still sound casual and jokey. A formal writer should still sound formal, just clearer. Punchier is not the same as generic.
4. **Engaging, not misleading.** Headlines and hooks should create curiosity the post actually pays off. Clickbait that overpromises hurts trust, shares, and repeat readers.
5. **Readers skim.** Most readers scan before they commit. Structure the post so a skimmer gets the value and is pulled into reading closely.

## The editing process

Work in passes, from big to small. Structural problems make line edits pointless, so fix them first.

### Pass 1: Find the point

Read the whole draft before changing anything. Answer for yourself:

- What is the one core idea or promise of this post, in a single sentence?
- Who is the reader, and what do they get from reading it?
- What is the single most interesting, surprising, or useful thing in the draft?

If the draft has no clear point, or has two competing ones, say so in your notes and edit toward the stronger one.

### Pass 2: Cut meandering and off-topic content

Hold every paragraph up against the core idea. Cut or condense anything that doesn't serve it:

- **Throat-clearing openings.** Posts often start with a paragraph or two of warm-up ("In today's fast-paced world…", "I've been thinking a lot lately about…"). The real start is often paragraph two or three. Cut to it.
- **Tangents.** Interesting asides that don't advance the point. If a tangent is genuinely great, note that it could be its own post.
- **Repetition.** The same point made twice in different words. Keep the better version.
- **Over-explaining.** Trust the reader. One clear example beats three.
- **Hedging and apologizing.** "I'm no expert, but…", "This might just be me…". Cut unless the humility is doing real work.
- **Limp endings.** Summaries that restate everything already said. End on the strongest idea, a clear takeaway, or a call to action instead.

Reorder sections if the logic or momentum improves. Lead with the strongest material, not the chronological order the writer thought of it in.

### Pass 3: Tighten the line level

Go sentence by sentence.

**Remove unnecessary words.**
- Filler: *very, really, just, actually, basically, literally, quite, rather, somewhat, totally*
- Wordy phrases: "in order to" → "to"; "due to the fact that" → "because"; "at this point in time" → "now"; "has the ability to" → "can"; "it is important to note that" → cut
- Redundancies: "end result," "past history," "completely eliminate," "future plans"
- Empty openers: "There is/are…," "It is…that…" → rebuild the sentence around the real subject

**Tighten tenses and verbs.**
- Keep tense consistent within a section. Don't drift between past and present without reason.
- Prefer simple tenses: "I have been working on" → "I'm working on"; "we would often go" → "we went"
- Prefer active voice: "The decision was made by the team" → "The team decided"
- Replace weak verb + noun combos with strong verbs: "make a decision" → "decide"; "give consideration to" → "consider"

**Shorten long sentences.**
- Split sentences over roughly 25–30 words, or any sentence the reader has to reread.
- Break up stacks of commas, semicolons, and parentheticals.
- Vary rhythm. A run of long sentences followed by a short one lands hard. Like this.

**Shorten paragraphs.** Online, paragraphs of 1–4 sentences read best. A one-sentence paragraph is a great tool for emphasis; don't overuse it.

### Pass 4: Punch it up

Now make the remaining content resonate.

**The headline.** Offer 3–5 alternatives alongside the original. Strong blog headlines usually do at least one of these:
- Promise a specific benefit ("How to Cut Your Grocery Bill in Half")
- Spark curiosity with a payoff the post delivers ("The Worst Advice I Ever Followed")
- Use specifics and numbers ("7 Mistakes…", "What 3 Years of…")
- Take a clear, slightly contrarian stance ("Stop Writing Morning Pages")

Keep headlines honest to the content and roughly under 70 characters where possible.

**The hook.** The first two or three sentences decide whether anyone keeps reading. Open with the most compelling thing available in the draft: a surprising claim, a vivid moment, a sharp question, a relatable problem, or the payoff itself. Never open with background.

**Concrete over abstract.** Where the writer is vague ("this had a big impact"), push toward specifics they already gave elsewhere, or flag the spot for them to fill in.

**Speak to the reader.** Use "you" where natural. Make the stakes personal: why should this reader care, right now?

**Stronger word choices.** Swap bland words for vivid ones in the writer's register. Cut clichés ("game-changer," "at the end of the day," "think outside the box") or replace them with something fresh.

**Shareable moments.** Sharpen one or two lines that a reader would want to quote, highlight, or post. Often these already exist but are buried mid-paragraph; move them to where they stand out.

**Skimmability.**
- Add or improve subheadings so a skimmer can follow the argument from headings alone. Make subheadings informative, not cute ("Why cheap tools cost more" beats "The Plot Thickens").
- Use bullet or numbered lists where the content is genuinely a list (steps, tips, options).
- Bold sparingly: at most one key phrase per section.

**The ending.** Close with momentum: a memorable final line, a clear takeaway, or a specific call to action (comment, subscribe, try this today). Don't fade out.

### Pass 5: Final read

Read the edited version top to bottom as a reader would. Check that:
- The post still says what the writer meant.
- Transitions still work after cuts and reordering.
- Nothing factual was added or altered.
- The voice is consistent.
- It's meaningfully shorter than the original unless the draft was already lean. Typical well-edited drafts lose 15–35% of their length.
- No em-dashes are used, because it looks like AI.

## Output format

Deliver the edit in this structure unless the user asks for something different:

```markdown
## Headline options
1. [Original headline, if any, labeled as original]
2. [Alternative]
3. [Alternative]
4. [Alternative]

## Edited post
[The full edited post, ready to publish, in Markdown with subheadings]

## Editor's notes
[3–7 short notes on the most important changes and why, e.g.
 - Cut the first two paragraphs; the post really starts at "Last March…"
 - Moved the pricing story to the top; it's the strongest hook.
 - Cut the section on X; it's off-topic but could be its own post.
 - Word count: 1,840 → 1,210.]

## Suggestions for the writer
[Optional. Things only the writer can supply: a missing example, a statistic
 to back a claim, a personal detail, a clearer call to action.]
```

Keep editor's notes brief and specific. The writer wants to understand the big decisions, not read a list of every comma you moved.

### Variations

- **"Just give me feedback"** or **"don't rewrite it"**: Skip the edited post. Give headline options, then prioritized notes with quoted examples from the draft and suggested fixes.
- **"Light edit"** or **"proofread"**: Do Pass 3 only (plus obvious typos and grammar). Don't cut sections or restructure.
- **"Heavy edit"** or **"make it go viral"**: Do all passes aggressively, including restructuring and substantial cuts.
- **Tracked-changes style requested**: Show deletions as ~~strikethrough~~ and additions in **bold**, or present before/after pairs for key passages.
- **Platform named** (LinkedIn, Substack, Medium, etc.): Adapt conventions. For example, LinkedIn favors a strong first line before the "see more" cutoff and very short paragraphs; newsletters benefit from a compelling subject line and preview text.

## Example edits

**Throat-clearing opening**

Before:
> In today's digital age, more and more people are starting to think about the ways in which they can be more productive. I've personally been on a journey with productivity for many years now, and I wanted to share some of the things I have learned along the way. One thing that really changed everything for me was when I stopped using to-do lists.

After:
> I stopped using to-do lists. It changed everything.

(The claim stays the writer's own. If the draft later gives a concrete result, such as "I finished my book in four months," pull that up into the hook instead.)

**Wordy sentence**

Before:
> It is important to note that due to the fact that most readers are skimming, there is a very real need for writers to make sure that their main points are able to be found quickly.

After:
> Most readers skim. Make your main points easy to find.

**Weak ending**

Before:
> So those are some of my thoughts on remote work. Hopefully some of this was helpful to you, and let me know what you think!

After:
> Remote work didn't make me lonely. Working without a routine did. Build the routine first.

(Built from the writer's own central point, restated as a sharp closer.)
