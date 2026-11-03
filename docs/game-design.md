# Project: Minion Campus
## Game Design Document & Implementation Brief

> **Source of truth for the game vision.** Stored verbatim as provided by the project owner.
> Do not edit design decisions here without owner approval. Provisional values and build order live in [`roadmap.md`](./roadmap.md).

**Document purpose:** This is the primary product vision and technical direction for Minion Campus. Use it to understand what we're building, why we're building it, how its systems should work together, and what belongs in the initial playable version versus future development.

Do not treat every idea in this document as a requirement to implement immediately. Feature priorities and status labels are intentional.

---

# 1. The Game

## 1.1 Core concept

Minion Campus is a cozy, whimsical, third-person creature-raising and collection game inspired by the spirit of Monster Rancher, modernized with a much larger discovery space, deeper individual creature personalities, and more meaningful relationships.

The player is a **Headmaster** who operates their own campus: a place where unique minions live, grow, train, socialize, and develop relationships with the player and one another.

The central gameplay revolves around:

- Discovering and acquiring minions.
- Raising and caring for individual minions.
- Building meaningful relationships with them.
- Training minions and developing their abilities.
- Breeding minions to discover new combinations and offspring.
- Using remains at the Beckoning Center to beckon new minions.
- Exploring the world to find remains, resources, and unusual discoveries.
- Optionally competing in tournaments.

This is fundamentally a creature-raising game, not exclusively a competitive monster-fighting game.

A player who never enters a tournament should still have a complete and enjoyable game. They can focus entirely on collecting, caring for, interacting with, and breeding minions.

## 1.2 The experience

The atmosphere should be:

- Cozy, happy, cute, whimsical, and welcoming.
- Colorful and full of personality.
- Relaxed, but with meaningful decisions and progression.
- Focused on discovery and attachment to individual creatures.

The player should become attached to their minions as individuals, not simply view them as interchangeable stat collections.

A minion should feel like a living character with its own appearance, history, personality, needs, preferences, and lifespan.

## 1.3 Three player motivations

The game should support several styles of play:

**The Caretaker:** Enjoys looking after minions, building relationships, discovering their personalities, and making the campus a happy home.

**The Collector and Discoverer:** Enjoys finding rare species, experimenting with breeding combinations, collecting remains, and discovering minions nobody else has found.

**The Competitor:** Enjoys training minions, improving their stats, and entering tournaments.

These playstyles should coexist. None should be mandatory.

---

# 2. Player and World

## 2.1 The Headmaster

The player is called a **Headmaster**.

The Headmaster owns and operates a campus. Their progression is based on their experience raising minions, discovering species, building relationships, and expanding their knowledge of the world.

The player should not need tournament victories to prove they are a capable Headmaster.

Headmaster progression can unlock access to increasingly unusual minions, facilities, resources, and opportunities.

## 2.2 The Campus

The campus is the player's home base.

It is where minions:

- Live and sleep.
- Eat and receive care.
- Train using purchased equipment.
- Play and socialize.
- Develop relationships.
- Spend time with the Headmaster.
- Grow older.

The campus should feel alive. Minions should visibly perform their assigned activities and have their own routines.

The player should be able to walk around and observe what is happening rather than managing everything through menus.

Campus construction and upgrades are part of the game, but the exact building system and facility catalog are not yet finalized.

## 2.3 Town

Town is a separate explorable environment.

The player physically walks around town in third person, interacts with NPCs, and visits facilities.

Potential locations include:

- Breeding Center.
- The Beckoning Center.
- Bank or minion storage facility.
- Shops.
- Tournament registration.
- Expedition registration.
- Other specialized facilities introduced later.

Facilities should generally be accessed by approaching and speaking to the appropriate NPC.

Town is also where the player acquires supplies, spends money, and discovers new opportunities.

## 2.4 Third-person gameplay

The intended perspective is third person.

The player should be able to walk around the campus and town, approach minions and NPCs, interact with objects, and observe the environment.

The world should be more than a collection of static menus.

First-person perspective is not currently planned.

## 2.5 Other Headmasters

**FUTURE FEATURE**

Eventually, players may visit other Headmasters and explore their campuses.

This is not required for the initial single-player version.

---

# 3. The Calendar and Day Cycle

This is one of the most important systems in the game.

## 3.1 Days advance only when the player chooses

The game uses discrete in-game days.

The player begins each session on their campus on a specific day, month, and season.

The player can spend as much real-world time as they want on that day.

**Time does not automatically advance while the player is away.**

Minions must never age, become exhausted, become hungry, or die simply because the player closed the game or stopped playing.

The player explicitly chooses when to end the day.

When the day advances, the simulation processes the consequences of that day.

## 3.2 Recommended calendar structure

Use this as the initial proposed calendar:

| Unit | Duration |
|---|---:|
| Day | 1 player-controlled turn |
| Week | 7 days |
| Month | 28 days |
| Season | 3 months |
| Year | 12 months |
| Seasons | 4 |

Each season contains three months.

This creates a 336-day in-game year.

The exact month names can be established later.

The calendar should be data-driven and configurable.

## 3.3 Seasons

The game has four seasons:

- Spring
- Summer
- Autumn
- Winter

Seasons should eventually influence events, festivals, available activities, environmental appearances, and potentially expedition discoveries.

Seasonal festivals and activities are planned, but their detailed mechanics are future work.

## 3.4 Ending the day

The player should have a clear End Day action.

Before advancing, the game should make it easy to review minion assignments and unresolved needs.

Advancing a day processes:

1. Assigned activities and training.
2. Hunger and food consumption.
3. Energy, fatigue, and sleep effects.
4. Happiness and relationship-related changes.
5. Aging and lifespan progression.
6. Health and other relevant conditions.
7. Breeding and other timed processes.
8. Calendar progression.
9. Daily reports and notifications.
10. Saving the resulting state.

The exact order should be deterministic and documented.

The player should receive a useful daily report explaining important changes, discoveries, and problems.

## 3.5 Real-world session length

A game day should be designed around approximately 5–10 minutes of ordinary gameplay as an initial target.

This is a usability target, not a timer or restriction.

Players can spend longer interacting with minions, exploring town, or simply enjoying the campus.

Do not make the game artificially slow to force players to spend real-world time waiting.

---

# 4. Minions

Minions are the heart of the game.

Each minion is an individual with its own identity, appearance, characteristics, needs, relationships, and lifespan.

## 4.1 Individual identity

Each minion should have:

- A unique ID.
- A species.
- An individual name.
- An appearance and collection of physical traits.
- Stats.
- Personality.
- Individual traits.
- Needs and current condition.
- Age and lifespan.
- Relationships.
- Parentage and breeding history, if applicable.
- Life history and significant events.

Two minions of the same species should not necessarily look alike.

Two players could own minions of the exact same species with noticeably different appearances.

## 4.2 Appearance and uniqueness

**CORE GAME VISION**

One of the game's major distinguishing features is the ability to produce highly individualized minions.

Differences can include:

- Height.
- Weight.
- Body proportions.
- Chunkiness or slenderness.
- Muscularity.
- Colors.
- Spots, stripes, and patterns.
- Ears.
- Horns.
- Tails.
- Facial features.
- Unusual physical characteristics.
- Mutations and rare visual features.

Appearance should be influenced by genetics and inherited traits.

A species defines a general creature identity, but it should not restrict every individual to exactly the same appearance.

A common species can still produce an exceptionally interesting-looking individual.

## 4.3 Rarity

Minions have rarity tiers.

Initial conceptual tiers:

- Common.
- Uncommon.
- Rare.
- Epic.
- Additional higher tiers to be defined.

Rarity should influence discovery difficulty, availability, and potentially the likelihood of unusual characteristics.

Rarity must not determine whether a minion is interesting or lovable.

Even common minions should have room for individuality.

## 4.4 Needs

The following needs are recommended starting systems. Their exact numerical ranges, decay rates, and interactions require balancing.

| Need | Purpose |
|---|---|
| Hunger | Minions need food regularly. |
| Energy | Minions need rest and sleep. |
| Happiness | Reflects general emotional well-being. |
| Affection | Reflects how loved and socially fulfilled a minion feels. |
| Health | Reflects physical condition and illness or injury. |
| Stress | Reflects pressure, overwork, and negative experiences. |

Needs should be meaningful without becoming an exhausting checklist.

A player should be able to learn how to care for their minions and develop efficient routines.

Poor care should have consequences, but the game should avoid making ordinary experimentation feel punishing.

## 4.5 Personality

Every minion should have a personality.

Personality influences how the minion behaves, what it enjoys, how it responds to the player, and what care it prefers.

Examples:

- Clingy.
- Independent.
- Energetic.
- Lazy.
- Shy.
- Playful.
- Curious.
- Stubborn.
- Affectionate.
- Nervous.

Personality should affect gameplay.

For example:

A clingy minion might need several affectionate interactions per day to feel fulfilled.

An independent minion might be perfectly happy with less attention.

An energetic minion might need less sleep or respond particularly well to physical activities.

A shy minion might take longer to develop trust.

The player should not necessarily know a minion's personality immediately.

Part of raising a minion is learning what makes that individual happy.

## 4.6 Individual traits

Traits are separate from general personality.

Traits can influence physical characteristics, behavior, needs, stats, health, lifespan, and breeding.

Examples:

- Naturally strong.
- Quick learner.
- High endurance.
- Light sleeper.
- Disease-prone.
- Long-lived.
- Energetic.
- Unusual coloration.
- Naturally anxious.

Traits can be inherited, acquired, or emerge through unusual circumstances.

The exact trait catalog and inheritance rules are future design work.

## 4.7 Stats

Stats primarily support training and tournaments in the initial design.

Potential starting stats:

- Strength.
- Intelligence.
- Speed.
- Defense.
- Endurance.
- Accuracy.

Additional stats such as patience may be explored later.

Stats should be distinct from needs and personality.

A minion can have high strength while being unhappy, exhausted, or poorly cared for.

Training should improve stats, and inherited genetics should influence starting potential.

Do not make every stat relevant to every system immediately. Keep the model extensible.

## 4.8 Relationships

Relationships are a core mechanic, not a decorative feature.

The player should be able to:

- Pet minions.
- Interact with them.
- Play with them.
- Feed them.
- Spend time with them.
- Learn their preferences.
- Build trust and affection.

Relationships should develop over time through consistent care and interaction.

Minions should respond differently depending on their personalities and relationship with the Headmaster.

Relationships may also influence breeding, death-related decisions, and special interactions.

## 4.9 Minion activity and behavior

Minions should visibly perform their assigned activities.

Examples:

- Exercising.
- Studying.
- Playing.
- Socializing.
- Eating.
- Sleeping.
- Resting.

When assigned an activity, the minion should move to or interact with the appropriate object where practical.

The player should be able to observe the activity happening in the 3D world.

## 4.10 Aging and lifespan

Every minion has an individual lifespan determined when it is born.

The maximum lifespan should be influenced by:

- Species.
- Genetics.
- Inherited traits.
- Health-related traits.
- Other unusual characteristics.

Two minions of the same species should generally have similar expected lifespans, but individual variation is important.

The player should not know the exact lifespan of a newly born minion.

### Care and lifespan

The maximum lifespan represents how long a minion could live under ideal circumstances.

Good care allows the minion to approach its maximum natural lifespan.

Poor care can shorten its life.

Care quality should consider accumulated conditions over time rather than making one missed meal or one bad day catastrophically damaging.

A minion with a disease or poor inherited health may have a shorter lifespan even with excellent care.

### Recommended implementation approach

Give each minion a hidden natural lifespan budget established at birth.

The simulation tracks aging and accumulated health or care penalties.

Under ideal care, the minion can reach its full lifespan budget.

Poor care increases the rate at which that budget is consumed.

The exact formula must be configurable and tested through simulations.

Avoid revealing an exact death date to the player.

The player should learn to recognize aging and declining health through observation and interactions.

### Death

Minions eventually die of old age or other applicable causes.

Death is permanent unless the player has access to the special revival mechanic described later.

Death should be emotionally meaningful, not a routine penalty.

The player should have the opportunity to preserve a minion's remains.

---

# 5. Daily Gameplay Loop

The basic daily experience should be:

1. Load into the campus.
2. See the current calendar date.
3. Walk around and check on minions.
4. Feed them and attend to their needs.
5. Pet, play with, and interact with them.
6. Check their condition and relationships.
7. Assign training, rest, or other activities.
8. Handle campus tasks.
9. Optionally visit town or perform other available activities.
10. Review the day.
11. End the day.
12. See the daily report and begin the next day.

The player should be encouraged to interact with individual minions, not simply open a management menu and press buttons.

As the campus grows, useful interfaces and quality-of-life features will be needed to make caring for many minions manageable.

Do not assume the player can meaningfully perform unlimited actions in one day. The daily action economy still needs balancing.

---

# 6. Training and Campus Equipment

## 6.1 Training philosophy

Training improves a minion's stats.

Training should be performed using equipment or activities available on the campus.

The player purchases equipment and assigns minions to use it.

## 6.2 Equipment examples

These are illustrative examples, not a finalized equipment catalog.

**Bowflex / Exercise Machine**

A minion uses the machine to train strength.

**Chessboard**

Two minions can play chess together, developing intelligence and potentially patience.

Other possible equipment:

- Running track.
- Weights.
- Obstacle course.
- Puzzle table.
- Meditation area.
- Swimming pool.
- Practice targets.

Each piece of equipment should have clearly defined effects, requirements, and potential drawbacks.

Equipment may eventually have levels, upgrades, or quality differences.

## 6.3 Assignments

The player assigns minions to activities for the day.

Examples:

- Train strength.
- Study intelligence.
- Play.
- Rest.
- Sleep.
- Socialize.

Some activities may require multiple minions.

The simulation determines their results when the day advances.

Training should interact with fatigue, energy, happiness, and potentially stress.

Overtraining should have consequences.

## 6.4 Campus expansion

The player should eventually be able to purchase and install equipment and construct or upgrade campus facilities.

**DETAILS TO BE DESIGNED**

Do not invent a complex building or construction system for the first playable version.

Start with a straightforward equipment placement or facility availability system that can be expanded later.

---

# 7. Food and Farming

Minions need to eat.

The player must acquire food and ensure their minions are fed.

Food may have different types and qualities, and different minions may eventually have different preferences.

Farming is a possibility, but it is not yet a confirmed requirement.

Potential food acquisition methods:

- Buying food in town.
- Finding food during expeditions.
- Growing food on campus.

Farming should remain optional until its gameplay value is clearer.

Do not build a large farming system into the initial version.

---

# 8. Breeding

Breeding is one of the defining mechanics of Minion Campus.

It is a major source of discovery, experimentation, and long-term progression.

## 8.1 Core breeding experience

The player selects two existing minions and sends them to the Breeding Center.

The player should be excited to discover what offspring will result.

The result should not simply be one of two predetermined parent appearances.

The offspring should be an individual influenced by both parents.

## 8.2 Gender

Minions have gender identities.

The game should support male, female, non-binary, gender-fluid, and other appropriate identities.

**Breeding compatibility is not determined by gender.**

Any two compatible minions can breed regardless of gender identity.

Do not enforce male/female pairing requirements.

## 8.3 Genetics

Genetics should work through an extensible inheritance system.

Offspring may inherit:

- Species characteristics.
- Physical traits.
- Colors and patterns.
- Body proportions.
- Stats and stat potential.
- Personality tendencies.
- Special traits.
- Lifespan tendencies.
- Health characteristics.

An offspring might inherit one trait from one parent and several from the other.

New traits or unusual combinations may emerge.

## 8.4 Environmental inheritance

A particularly interesting possibility is that the experiences of the parents influence their offspring.

For example, two parents that experienced prolonged neglect or poor care might produce offspring with an increased tendency toward anxiety or depression.

This should be implemented carefully.

The game should model inherited tendencies and predispositions, not guarantee that offspring receive a negative condition.

Likewise, positive experiences and strong development may influence offspring traits.

This system is intended to make raising parents meaningfully relevant to breeding.

## 8.5 Species discovery

Breeding should allow players to discover new species or unusual combinations.

The possible discovery space should be much larger than the original Monster Rancher experience.

Some combinations should be common and predictable.

Others should be extremely rare.

Some discoveries may have very low probabilities, potentially around one in a thousand or rarer.

The player should feel rewarded for experimentation.

Special conditions, facilities, or resources may improve the chance of discovering unusual species.

## 8.6 Breeding duration and uncertainty

Breeding should take time.

A proposed starting duration is approximately one in-game day, subject to testing.

The player should not receive an exact preview of the offspring's appearance.

The intended experience is approximately:

- 93% mystery.
- 7% predictability.

This is a conceptual target rather than a literal probability calculation.

Players may receive clues about likely inherited characteristics, possible species, or unusual traits, but the actual offspring should still be a discovery.

## 8.7 Breeding architecture

Genetics and game rules should be deterministic and owned by the simulation.

Do not allow an AI model to arbitrarily decide a minion's stats, lifespan, or genetic inheritance.

Use deterministic rules to produce the offspring's species, traits, stats, and physical parameters.

AI-assisted appearance generation may later translate those parameters into a unique visual model.

The same genetic inputs and simulation seed should be reproducible.

---

# 9. Beckoning and The Beckoning Center

## 9.1 Terminology

The facility is called **The Beckoning Center**.

The process of using remains to bring a minion into existence is called **Beckoning**.

Use these terms consistently.

Do not call this cloning.

## 9.2 Remains

The player can acquire remains through:

- Expeditions.
- Purchasing them.
- Tournament rewards.
- Other discoveries and events.

Some remains may be unknown or mysterious.

Others may be curated or have improved chances of producing rare minions.

Remains can be used at The Beckoning Center to beckon a minion.

## 9.3 Beckoning outcomes

Beckoning may produce:

- A known species.
- An unusual variation of a known species.
- A rare minion.
- A previously undiscovered species or form.

The exact relationship between remains and outcomes remains to be designed.

## 9.4 Headmaster progression and eligibility

Access to increasingly rare minions should depend on the Headmaster's experience and history.

It should not simply depend on tournament victories.

Relevant progression may include:

- Number of minions encountered.
- Number of minions raised.
- Length of caretaking history.
- Number of species discovered.
- Relationships developed.
- Other meaningful accomplishments.

Some extremely rare or ancient minions may refuse to be beckoned by an inexperienced Headmaster.

They may effectively require the player to prove they are a worthy caretaker.

This gives rare minions a sense of agency and makes progression feel earned.

## 9.5 Special resources

Some minions may require extremely rare resources or special conditions to beckon.

The exact resource catalog is future design work.

---

# 10. Death, Remains, and Revival

Death should be permanent by default.

However, there is a special, exceptionally difficult way to revive a minion.

## 10.1 Requesting remains

When a minion is approaching the end of its life, the Headmaster may ask whether it would be willing to leave its remains behind after death.

This is an optional interaction.

The minion considers the request for approximately one or two in-game weeks.

Eventually, it comes to the Headmaster and communicates its decision.

It may agree or decline.

The relationship between the minion and the Headmaster should influence this decision.

## 10.2 Revival

**SPECIAL, FUTURE-LEANING MECHANIC**

The player may eventually acquire an exceptionally difficult-to-obtain resource that allows a deceased minion to be revived.

The revived minion is the exact same individual.

It is not a replacement or a newly generated minion.

It retains its identity, history, and previous lifetime's development.

Its next lifetime begins with its previous experiences and stats taken into account.

The goal is to allow a deeply meaningful relationship to continue beyond a normal lifespan.

This should be extremely difficult and special.

Do not make ordinary death meaningless by making revival easy.

The precise resource, process, and effects of revival are not yet defined.

---

# 11. Expeditions and Exploration

Expeditions are a way to explore beyond the campus and town.

## 11.1 Registration

The player visits an expedition facility in town and signs up.

They select which minions to bring.

Whether an expedition supports one minion, multiple minions, or different party sizes is undecided.

Build the system so party size can be configured later.

## 11.2 Exploration

An expedition takes place in a larger explorable outdoor environment.

The player can walk around and search for things.

Potential discoveries include:

- Remains.
- Money.
- Food.
- Items.
- Rare resources.
- Unusual locations.
- New species clues.
- Other surprises.

The player may be able to search for particular categories of items or remains.

## 11.3 Expedition gameplay

Expeditions should feel like exploration rather than simply clicking a button and receiving randomized rewards.

The player should be able to move through an environment, investigate locations, and discover things.

Minions accompanying the player may eventually contribute based on their traits, stats, or abilities.

**DETAILS TO BE DESIGNED**

The first playable version does not need a fully developed expedition world.

The system should be architected so expeditions can be added without rewriting the core game.

---

# 12. Town Economy and Progression

## 12.1 Earning money

Potential sources of money include:

- Tournaments.
- Expeditions.
- Selling items.
- Other activities and rewards.

The final economy has not been defined.

## 12.2 Spending money

Money may be used to purchase:

- Training equipment.
- Food.
- Supplies.
- Remains.
- Campus improvements.
- Facility access or services.

Shops and NPC interactions should be part of town exploration.

## 12.3 Headmaster progression

Headmaster progression should represent experience and accomplishments as a caretaker.

Potential factors:

- Number of minions raised.
- Number of minions encountered.
- Number of species discovered.
- Relationships developed.
- Caretaking history.
- Breeding discoveries.
- Expedition discoveries.

Progression unlocks access to more advanced facilities, rare minions, and special opportunities.

It should not be exclusively tournament-based.

---

# 13. Tournaments and Combat

Tournaments are an optional competitive activity.

The player can train minions and enter tournaments against AI-controlled opponents.

Combat details have not been designed yet.

The initial game should establish the ability to train minions and support a basic tournament loop, but the exact battle system can be developed separately.

The simulation architecture should keep tournament rules separate from the rest of the game.

A player should never be forced to participate in tournaments to enjoy the core game.

---

# 14. Festivals and Seasonal Events

**FUTURE FEATURE**

There should eventually be several festivals per season.

The player can choose whether to attend.

Events may include:

- Seasonal celebrations.
- Special activities.
- Minion competitions.
- Social opportunities.
- Rare item discoveries.
- Special NPC interactions.
- Limited-time opportunities.

The exact events and mechanics are not yet designed.

The calendar should support scheduled events from the beginning, even if the first playable version does not contain a full festival system.

---

# 15. Starter Minion Questionnaire

The player's first minion is determined through a questionnaire.

The player does not simply choose a starter species from a list.

Instead, the game asks questions and uses the answers to determine an appropriate starter minion.

## 15.1 Questionnaire lengths

There are three options:

| Questionnaire | Questions | Starter pool |
|---|---:|---|
| Quick | 10 | Common, ordinary starter minions |
| Intermediate | 25 | Better and more unusual possibilities |
| Exhaustive | 50 | Guaranteed Rare or Epic minion |

The longer questionnaires should provide access to more interesting starter possibilities.

The exhaustive questionnaire guarantees a Rare or Epic starter.

## 15.2 Matching

The answers should be analyzed to determine which minion best fits the player.

The exact questionnaire, scoring, species pools, and matching algorithm are future content-design work.

AI-assisted matching is part of the intended experience.

However, the initial implementation should remain compatible with the serverless architecture.

Use an authored, deterministic scoring system as the initial implementation unless a local or explicitly configured AI solution is available.

Do not introduce a mandatory external API or expose API keys in the client.

The matching system should be replaceable by an AI-backed implementation later without changing the minion data model.

---

# 16. AI and Procedural Generation

AI is an important part of the long-term vision, but it should not become a dependency for core simulation correctness.

## 16.1 AI-assisted minion appearance

The long-term goal is for each minion to have a genuinely unique appearance.

An AI system may eventually examine:

- Parent 3D models.
- Parent physical traits.
- Genetic inheritance.
- Species.
- Body proportions.
- Colors and patterns.
- Special characteristics.

It can then help generate a unique visual representation of the offspring.

The intended result is that two players breeding the same species combination will receive different-looking offspring. If 3 of the same species were on the same campus, they could each be identified simply by looking at them, their size, their body shape, their unique features, marks, coloration, etc.

## 16.2 Deterministic simulation first

The simulation must own the actual game rules.

It determines:

- Species.
- Genetics.
- Stats.
- Traits.
- Lifespan.
- Needs.
- Relationships.
- Breeding outcomes.
- Progression.
- Tournament results.

AI should not randomly override these values.

AI-generated appearances should be derived from a valid minion description produced by the simulation.

This separation is critical.

## 16.3 Implementation stages

**INITIAL VERSION**

Use procedural or authored visual variations based on genetic and physical traits.

**FUTURE VERSION**

Explore AI-assisted generation of unique 3D minion models or appearance assets.

The game must remain playable if AI generation is unavailable.

Do not build an architecture that requires a generative AI service for ordinary gameplay.

---

# 17. Initial Playable Version vs. Future Features

The following distinction is important.

## 17.1 Initial playable version

The first playable version should focus on proving the core experience.

Required:

- Third-person movement.
- Campus environment.
- Basic town environment.
- Interactions with minions and NPCs.
- A starter questionnaire.
- Receiving a starter minion.
- Minion identity and data model.
- Basic minion needs.
- Feeding and petting.
- Basic relationship progression.
- Minion personalities and traits in a foundational form.
- Training assignments.
- Basic training equipment.
- Day advancement.
- Calendar and seasons.
- Aging.
- Basic lifespan simulation.
- Daily reports.
- Save and load.
- A basic tournament loop against AI.
- Basic breeding between two minions.
- Initial genetic inheritance.
- The Beckoning Center in a basic form.
- Remains as an acquisition and beckoning resource.

The initial version should make the player feel like they are genuinely raising a minion.

## 17.2 Future features

Do not attempt to implement all of these immediately:

- Advanced AI-generated 3D minion appearances.
- Fully developed species discovery and rare genetic mutations.
- Complex breeding inheritance.
- Advanced inherited behavioral tendencies.
- Extensive equipment catalogs.
- Full campus construction and customization.
- Farming.
- Large expedition environments.
- Advanced expedition mechanics.
- Full festival and seasonal event systems.
- Advanced revival mechanics.
- Complex combat.
- Extensive tournament systems.
- Visiting other Headmasters.
- Multiplayer.
- Other social and online features.

These are intentional future opportunities.

Do not let them complicate the initial playable version unnecessarily.

---

# 18. Technical Architecture

The project should remain serverless and single-player for the initial version.

## 18.1 Technology stack

- Vite.
- Strict TypeScript.
- pnpm workspaces.
- Svelte 5 with runes.
- Threlte.
- Three.js.
- Rapier for character movement and physics.
- Miniplex ECS for in-scene entities only.
- IndexedDB for persistence.
- Vitest for simulation tests.
- GitHub Pages for deployment.

No backend is required.

Multiplayer is a possible future direction, not an initial requirement.

## 18.2 Repository organization

Use the existing repository structure where possible.

The intended architecture is:

**apps/client**

Responsible for the browser game.

Potential organization:

- Scenes: town, campus, arena, scene manager.
- World: player, camera, interactables.
- UI: HUD, minion panel, dialogue, day report.
- State: stores wrapping simulation state.
- Persistence: save and load.

**packages/sim**

Pure TypeScript game simulation.

Responsible for:

- Calendar.
- Day advancement.
- Minion state.
- Needs.
- Aging.
- Relationships.
- Training.
- Breeding.
- Beckoning.
- Campus state.
- Tournaments.
- Economy.

**packages/content**

Static game content.

Responsible for:

- Species.
- Traits.
- Personalities.
- Equipment.
- Facilities.
- NPCs.
- Dialogue.
- Items.
- Events.

**Future packages**

Additional packages can be introduced when justified.

Do not create unnecessary abstractions or packages just because a future feature might need them.

## 18.3 Simulation architecture

The simulation must be independent of the rendering engine and UI.

Game state should be plain serializable data.

Simulation functions should be deterministic wherever practical.

A core example:

`advanceDay(state, assignments) => { nextState, report }`

The simulation should not depend on Svelte, Three.js, browser objects, or ECS entities.

Scenes should render the state and forward player actions to the simulation.

Scenes should be disposable views, not the source of truth.

## 18.4 Day advancement

All daily simulation effects should be processed through a centralized day-advancement pipeline.

This prevents different parts of the game from independently modifying age, needs, training, and other values.

Use deterministic ordering.

Make simulation calculations independently testable.

## 18.5 ECS

Miniplex should only manage entities that exist in the active scene.

Do not use ECS as the permanent storage model for minion ownership, genetics, or other game state.

A minion's persistent identity and simulation state should exist independently of whether its 3D representation is currently loaded.

## 18.6 State management

Use Svelte stores or suitable Svelte 5 state patterns to expose simulation state to the UI.

UI actions should call simulation functions.

Do not duplicate game rules inside UI components.

Per-frame values should live in appropriate references or ECS components rather than causing unnecessary reactive updates.

## 18.7 Scene management

Use a scene manager state machine.

Scenes should be independently loadable and disposable.

Share the player controller and camera systems where practical.

Use one consistent interaction system for NPCs, minions, and world objects.

## 18.8 Persistence

Use IndexedDB for save data.

Save plain simulation state, including a schema version.

Autosave after day advancement.

Support save export and import.

The player should not lose progress because of a page refresh or browser restart.

Future save migrations should be considered when changing the state schema.

## 18.9 AI opponents

AI tournament opponents should use the same match rules as the player's minions.

Do not create a separate combat system for AI opponents.

This will also make a future multiplayer implementation easier.

---

# 19. Code Standards

Follow these project conventions:

- Strict TypeScript.
- Arrow functions only.
- No function declarations.
- No classes.
- No destructuring.
- No `else` statements.
- Descriptive names.
- Boolean variables should use clear boolean prefixes where appropriate.
- Custom types end in `T`.
- Use `type`, not `interface`.
- Use type-only imports where appropriate.
- Keep functions small and flat.
- Prefer straightforward control flow.
- Use async/await.
- Avoid unnecessary abstractions.
- Comments should be sparse and useful.
- Add blank lines before multiline functions, objects, and invocations.

CSS conventions:

- Kebab-case class names.
- Modifier classes use `.base.isModifier`.
- Keep CSS in sibling files.
- Use design tokens.
- Avoid inline styles.
- Avoid unnecessary shadows and gradients.

Do not introduce linting or Prettier unless explicitly requested.

Do not run builds, typechecks, or tests constantly after every tiny change. Run them at meaningful milestones and when validating completed work.

---

# 20. Development Approach

Work incrementally.

Do not attempt to implement the entire game at once.

Before making changes:

1. Inspect the existing repository.
2. Understand the existing structure and conventions.
3. Identify what already exists.
4. Avoid replacing working systems unnecessarily.
5. Explain the proposed next step before implementing it if the work is substantial.

## Proposed development order

**Step 1 — Project foundation**

- Inspect the repository.
- Establish or verify the Vite and Svelte setup.
- Establish the 3D scene.
- Implement basic third-person movement.
- Verify the project runs.

**Step 2 — World interaction**

- Interactable system.
- NPC interaction.
- Minion interaction.
- Dialogue foundation.

**Step 3 — Simulation foundation**

- Pure TypeScript simulation package.
- Game state.
- Calendar.
- Minion data model.
- Day advancement.
- Basic needs and aging.
- Tests.

**Step 4 — Campus gameplay**

- Campus environment.
- Minion presence and behavior.
- Minion panel.
- Feeding and petting.
- Training assignments.
- Basic equipment.
- End Day action.
- Daily report.
- IndexedDB persistence.

**Step 5 — Starter experience and town**

- Starter questionnaire.
- Starter minion matching.
- Town environment.
- NPCs and facility interactions.
- Basic economy.

**Step 6 — Breeding and Beckoning**

- Breeding Center.
- Initial inheritance system.
- The Beckoning Center.
- Remains and beckoning.

**Step 7 — Tournament**

- Basic arena.
- AI opponents.
- Initial match rules.

**Step 8 — Expansion**

- Expeditions.
- More species.
- More equipment.
- Advanced genetics.
- Additional systems as prioritized.

Only work on the current approved step.

After completing a step, explain what was implemented, identify anything unfinished, and stop for approval before proceeding.

---

# 21. Important Design Principles

These principles should guide decisions when details are not yet specified.

1. **Minions are individuals.** Avoid systems that make them feel like interchangeable units.

2. **Relationships matter.** Care and interaction are central gameplay, not optional decoration.

3. **Discovery should be exciting.** Breeding and beckoning should create genuine anticipation.

4. **The world should feel alive.** Minions should visibly behave like creatures with routines and personalities.

5. **Time belongs to the player.** Days advance only when explicitly requested.

6. **Combat is optional.** The game must remain enjoyable without tournaments.

7. **Progression is broader than competition.** Caretaking, exploration, and discovery all count.

8. **AI must not compromise game rules.** Deterministic simulation owns stats, genetics, lifespan, and outcomes.

9. **Future features should not burden the first version.** Build extensibly, but do not implement speculative complexity prematurely.

10. **Preserve the cozy atmosphere.** Even difficult mechanics like aging and death should fit the game's warm, whimsical identity.

---

# 22. Open Design Questions

The following are intentionally unresolved. Do not invent final answers without discussion.

- Exact minion needs, ranges, and decay rates.
- Exact lifespan distributions by species.
- Exact relationship and personality formulas.
- Full stat catalog.
- Full trait catalog.
- Training effectiveness and fatigue formulas.
- Food types and nutritional effects.
- Farming mechanics.
- Campus building and customization.
- Exact month names and calendar tuning.
- Breeding probabilities and inheritance formulas.
- Species discovery rules.
- Beckoning outcome rules.
- Rare remains and resource catalog.
- Revival requirements and consequences.
- Expedition party size and mechanics.
- Economy and item prices.
- Tournament and combat mechanics.
- Festival activities.
- AI-generated model technology.

Use sensible, configurable placeholders where implementation requires values. Clearly identify them as provisional.

Do not silently turn unresolved ideas into permanent game design decisions.

---

# 23. Final Direction

The most important thing to understand is that **Minion Campus is about raising minions, not simply collecting monsters to fight.**

The player should log in, arrive at their campus, see their minions living their lives, spend time with them, care for them, train them, discover their personalities, and build relationships.

They should look forward to seeing what happens when they breed two minions together.

They should be excited when they discover unusual remains and wonder what they might beckon.

They should feel that every minion has its own story.

The first playable version should prove that this experience is fun before expanding into the enormous possibilities of the full game.

Build the foundation carefully. Keep the simulation clean, the systems extensible, and the experience centered on the minions.
