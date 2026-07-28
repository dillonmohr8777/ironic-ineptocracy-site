extends Node
## Party (autoload) — the Courier's deposed evidence, items, and dossier.

const MAX_PARTY := 6

var members: Array = []          # Array[Manifest]
var items := {"blank_affidavit": 5, "hot_meal_item": 2}
var dossier := {}                # species_id -> "seen" | "filed"


func reset() -> void:
	members = []
	items = {"blank_affidavit": 5, "hot_meal_item": 2}
	dossier = {}


func add_member(m: Manifest) -> bool:
	mark(m.species_id, "filed")
	if members.size() >= MAX_PARTY:
		return false  # future: box system ("deep storage")
	members.append(m)
	return true


func first_healthy() -> Manifest:
	for m in members:
		if not m.is_discredited():
			return m
	return null


func healthy_count() -> int:
	var n := 0
	for m in members:
		if not m.is_discredited():
			n += 1
	return n


func heal_all() -> void:
	for m in members:
		m.resolve = m.max_resolve()
		m.reset_stages()


func mark(species_id: String, status: String) -> void:
	if status == "filed" or dossier.get(species_id, "") != "filed":
		dossier[species_id] = status


func filed_count() -> int:
	var n := 0
	for k in dossier:
		if dossier[k] == "filed":
			n += 1
	return n


func use_item(id: String) -> bool:
	if int(items.get(id, 0)) <= 0:
		return false
	items[id] = int(items[id]) - 1
	return true


func serialize() -> Dictionary:
	var ms := []
	for m in members:
		ms.append(m.to_dict())
	return {"members": ms, "items": items, "dossier": dossier}


func deserialize(d: Dictionary) -> void:
	members = []
	for md in d.get("members", []):
		members.append(Manifest.from_dict(md))
	items = d.get("items", {"blank_affidavit": 5})
	dossier = d.get("dossier", {})
