extends Node
## SaveSystem (autoload) — one save slot. The save screen is a NOTARIZE stamp.

const SAVE_PATH := "user://dossier_save.json"


func has_save() -> bool:
	return FileAccess.file_exists(SAVE_PATH)


func save_game(player_position: Vector2) -> void:
	var data := {
		"version": 1,
		"zone": Game.current_zone,
		"position": [player_position.x, player_position.y],
		"flags": Game.flags,
		"record": Game.record,
		"convenience": Game.convenience,
		"party": Party.serialize(),
	}
	var f := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(data, "  "))


## Loads the save and switches to the saved zone. Returns false if no/invalid save.
func load_game() -> bool:
	if not has_save():
		return false
	var parsed = JSON.parse_string(FileAccess.get_file_as_string(SAVE_PATH))
	if parsed == null or not (parsed is Dictionary):
		return false
	Game.flags = parsed.get("flags", {})
	Game.record = int(parsed.get("record", 0))
	Game.convenience = int(parsed.get("convenience", 0))
	Party.deserialize(parsed.get("party", {}))
	var pos: Array = parsed.get("position", [0, 0])
	Game.goto_zone(parsed.get("zone", "west7th"), Vector2(pos[0], pos[1]))
	return true
