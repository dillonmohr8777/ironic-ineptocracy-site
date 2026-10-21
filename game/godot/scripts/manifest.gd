class_name Manifest
extends RefCounted
## A runtime instance of a Manifestation (one filed piece of machinery).
## Species data lives in data/manifestations.json; this holds the mutable state.

var species_id: String
var level: int = 5
var xp: int = 0
var resolve: int = 0          # current HP ("Resolve")
var stages := {"pressure": 0, "insulation": 0, "tempo": 0}  # battle-only
var bond: int = 0             # arguments survived alongside the Courier


static func create(p_species_id: String, p_level: int) -> Manifest:
	var m := Manifest.new()
	m.species_id = p_species_id
	m.level = p_level
	m.resolve = m.max_resolve()
	return m


func species() -> Dictionary:
	return DataStore.species.get(species_id, {})


func display_name() -> String:
	return species().get("name", species_id)


func base_stat(stat: String) -> int:
	return int(species().get("base", {}).get(stat, 50))


func max_resolve() -> int:
	return int(base_stat("resolve") * 2 * level / 50.0) + level + 12


func stat(stat_name: String) -> int:
	return int(base_stat(stat_name) * 2 * level / 100.0) + 5


## Battle stat with stage multiplier applied.
func battle_stat(stat_name: String) -> float:
	var s: int = stages.get(stat_name, 0)
	var mult := (2.0 + s) / 2.0 if s >= 0 else 2.0 / (2.0 - s)
	return stat(stat_name) * mult


func is_discredited() -> bool:
	return resolve <= 0


func reset_stages() -> void:
	stages = {"pressure": 0, "insulation": 0, "tempo": 0}


## Up to four most recently learned moves.
func known_moves() -> Array:
	var pool := []
	var learnset: Dictionary = species().get("learnset", {})
	var levels := learnset.keys()
	levels.sort_custom(func(a, b): return int(a) < int(b))
	for lvl in levels:
		if int(lvl) <= level:
			for mid in learnset[lvl]:
				if not pool.has(mid):
					pool.append(mid)
	return pool.slice(max(0, pool.size() - 4))


func xp_to_next() -> int:
	return level * 20


## Returns array of log strings (level-ups, new tactics).
func gain_xp(amount: int) -> Array:
	var log := []
	xp += amount
	while xp >= xp_to_next():
		xp -= xp_to_next()
		var before := known_moves()
		level += 1
		resolve = min(resolve + 4, max_resolve())
		log.append("%s reaches level %d. The corroboration holds." % [display_name(), level])
		for mid in known_moves():
			if not before.has(mid):
				log.append("%s learned the tactic %s." % [display_name(), DataStore.moves[mid]["name"]])
	return log


func to_dict() -> Dictionary:
	return {
		"species_id": species_id, "level": level, "xp": xp,
		"resolve": resolve, "bond": bond,
	}


static func from_dict(d: Dictionary) -> Manifest:
	var m := Manifest.new()
	m.species_id = d.get("species_id", "receipt")
	m.level = int(d.get("level", 5))
	m.xp = int(d.get("xp", 0))
	m.resolve = int(d.get("resolve", m.max_resolve()))
	m.bond = int(d.get("bond", 0))
	return m
