extends Node
## DataStore (autoload) — loads and validates every JSON data file.
## All game content is data-driven; adding a chapter means adding JSON,
## never editing this script.

var species: Dictionary = {}
var moves: Dictionary = {}
var items: Dictionary = {}
var zones: Dictionary = {}
var dialogues: Dictionary = {}
var affinities: Dictionary = {}
var type_chart: Dictionary = {}


func _ready() -> void:
	_load_all()
	var errors := validate()
	for e in errors:
		push_error("[data] " + e)
	if OS.get_cmdline_user_args().has("--check-data"):
		if errors.is_empty():
			print("DATA OK: %d species, %d moves, %d zones, %d dialogue sets" % [
				species.size(), moves.size(), zones.size(), dialogues.size()])
			get_tree().quit(0)
		else:
			print("DATA ERRORS: %d" % errors.size())
			get_tree().quit(1)


func _load_all() -> void:
	species = _load_json("res://data/manifestations.json")
	moves = _load_json("res://data/moves.json")
	items = _load_json("res://data/items.json")
	var types: Dictionary = _load_json("res://data/types.json")
	affinities = types.get("affinities", {})
	type_chart = types.get("chart", {})
	zones = _load_dir("res://data/zones")
	dialogues = {}
	for d in _load_dir("res://data/dialogue").values():
		dialogues.merge(d)


func _load_json(path: String) -> Dictionary:
	var text := FileAccess.get_file_as_string(path)
	if text.is_empty():
		push_error("[data] missing or empty file: " + path)
		return {}
	var parsed = JSON.parse_string(text)
	if parsed == null or not (parsed is Dictionary):
		push_error("[data] invalid JSON: " + path)
		return {}
	return parsed


func _load_dir(dir_path: String) -> Dictionary:
	var out := {}
	var dir := DirAccess.open(dir_path)
	if dir == null:
		return out
	for f in dir.get_files():
		if f.ends_with(".json"):
			var data := _load_json(dir_path + "/" + f)
			out[f.get_basename()] = data
	return out


## Type effectiveness multiplier of an attack type against a defender's affinities.
func effectiveness(attack_type: String, defender_affinities: Array) -> float:
	var mult := 1.0
	var row: Dictionary = type_chart.get(attack_type, {})
	for a in defender_affinities:
		mult *= float(row.get(a, 1.0))
	return mult


## Referential integrity for every data file. Returns a list of error strings.
func validate() -> Array:
	var errors := []
	for sid in species:
		var s: Dictionary = species[sid]
		for lvl in s.get("learnset", {}):
			for mid in s["learnset"][lvl]:
				if not moves.has(mid):
					errors.append("species '%s' references unknown move '%s'" % [sid, mid])
		var evo = s.get("evolves_to")
		if evo != null and not species.has(evo):
			errors.append("species '%s' evolves to unknown species '%s'" % [sid, evo])
		for a in s.get("affinities", []):
			if not affinities.has(a):
				errors.append("species '%s' has unknown affinity '%s'" % [sid, a])
	for mid in moves:
		var t: String = moves[mid].get("type", "")
		if not affinities.has(t):
			errors.append("move '%s' has unknown type '%s'" % [mid, t])
	for zid in zones:
		var z: Dictionary = zones[zid]
		for patch in z.get("patches", []):
			for entry in patch.get("table", []):
				if not species.has(entry.get("species", "")):
					errors.append("zone '%s' encounter references unknown species '%s'" % [zid, entry.get("species")])
		for npc in z.get("npcs", []):
			var d: String = npc.get("dialogue", "")
			if d != "" and not dialogues.has(d):
				errors.append("zone '%s' npc '%s' references unknown dialogue '%s'" % [zid, npc.get("id"), d])
	return errors
