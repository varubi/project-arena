## Definitions
**Entity** - Any controllable character in an encounter

**Attribute** - Any value that can be represented numerically on an `Entity`. Stats, Roll Modifiers, Health, Casts, Level.

**Ability** - An entity action that applies 1 or more `Effect`s.

**Effect** - An effect is a group of `Modifier`s that last a specific duration or no duration. 

**Modifier** - A formula to modify an `Attribute`.

**Roll** - A dice roll

**Tick** - An interval that can be any combination of `action` | `turn` | `round` | `encounter` | `realtime` | `Encounter Event`.

**Priorty** - Major/Minor values that define priorty, 2 values for tiering priorty.

## Requirements

### Ability
- Allow any combination of everything below
- Surpress any effects _ex: House Rules_
- Evalute successful application _Hit or Miss/Attack Roll_
- Allow all rolls to be adjustable
- Take in input _ex: Spell Cast Level_
- Apply new effect
- Keep track of a cooldown _Not enforced_
- Access to source and target data
  - Attributes
  - Effects list
- Store own data

### Effects
- Allow any combination of everything below
- Surpress any effects _ex: House Rules_
- Evalute successful application _Hit or Miss/Attack Roll_
- Allow all rolls to be adjustable
- Take in input _ex: Spell Cast Level_
- Keep track of a cooldown _Not enforced_
- Access to source and target data
  - Attributes
  - Effects list
- Store own data
- Have a duration
- Remove other effects
- Modify attribute temporarily
- Modify attribute on a source
- Modify attribute on a target
- Modify attribute at a tick _n_ times
- Apply new effect
- Remove itself
- Remove other effects
- Differentiate between purge and expiration
- Access to encounter events
  - Attribute Modifications
  - Ability casts
  - Rolls
- Access to data
  - Internal counters/variables
  - Tick history
  - List of targets from one of(Encounter|Ability|Effect|ParentEffect|ChildEffects)
  - Ancestor Effects
  - Descendant Effects
  - Ability 
- Suspend effect while event
- Redirect attribute modification partially or entirely
- Stop event propogation to other effects _ex: If multiple shields are present. Only remove from one_
- Evalute modifiers at initialization
- Evalute modifiers at each tick
- Allow priorty sorting for multiple effects that may tick at the same time or event
- Have multiple tick types
- Tick only once if set to listen to multiple tick types _ex: If an action ends a turn do not tick for the action and then the again for the turn_
- Evalulate  a modifier for an attribute and distribute to multiple targets
  - Evenly
  - Equaly`
  - Ability predefined _ex: Main target takes double damage_
  - Player can override 

Examples Spells:  
**Attack**  
_Target takes 10 damage_

**Moonfire - WOW**  
_A quick beam of lunar light burns the enemy for Arcane damage and then an additional Arcane damage over X sec._

**Tranquil Boots - DOTA2**  
_Whenever you attack a hero or are attacked by any unit, the bonus 16 HP regen is lost and the movement speed bonus is reduced to 18% for 13 seconds._

**Cheat Death - WOW**  
_Fatal attacks instead reduce you to 7% of your maximum health. For 3 sec afterward, you take 85% reduced damage. Cannot trigger more often than once per 6 min._

**Chain Frost - DOTA2**  
_Releases an orb of frost that bounces between nearby enemy units up to 10 times, slowing and damaging each time it hits._

**Fatal Bonds - DOTA2**  
_Binds several enemy units together, causing a percentage of the damage dealt to one of them to be felt by the others._

**Purifying Flames - DOTA2**  
_Burns away impurities, dealing heavy magic damage to the target before causing them to regenerate health over time. The amount of health regenerated over its duration exceeds the amount of initial damage. Can be cast on enemies and allies._

**False Promise - DOTA2**  
_Temporarily alters an ally's destiny, delaying any healing or damage taken until False Promise ends. Any healing that is delayed by False Promise is doubled. Removes most negative status effects and disables on initial cast._

**Ice Armor - WOW**  
_Increases Armor by X and frost resistance by Y. If an enemy strikes the caster, they may have their movement slowed by 30% and the time between their attacks increased by 25% for 5 sec. Only one type of Armor spell can be active on the Mage at any time._

**Mage Armor - WOW**  
_The duration of all harmful Magic effects used against you is reduced by 25%._

**Mana Shield - WOW**  
_Prismatic Barrier has no cooldown, but your mana is drained by 50% of the damage it absorbs._

**Living Bomb - WOW**  
_The target becomes a Living Bomb, taking Fire damage over 4 sec, and then exploding to deal an additional Fire damage to the target and all other enemies within 10 yards. Other enemies hit by this explosion also become a Living Bomb, but this effect cannot spread further._
