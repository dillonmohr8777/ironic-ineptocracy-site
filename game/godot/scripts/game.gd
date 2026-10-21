extends Node
## Game (autoload) — scene flow, story flags, the Record/Convenience ledger.

const TITLE_SCENE := "res://scenes/Title.tscn"
const ZONE_SCENE := "res://scenes/Zone.tscn"
const BATTLE_SCENE := "res://scenes/Battle.tscn"

var flags := {}                  # story flags, e.g. "prologue_done"
var record := 0                  # kept first versions (the network trusts you)
var convenience := 0             # accepted corrections (the doors open)
var current_zone := "west7th"
var return_position := Vector2.ZERO   # player position to restore after a battle
var pending_battle: Dictionary = {}   # {species, level}


func _ready() -> void:
	_add_wasd_bindings()


## WASD aliases for the built-in ui_* actions, plus E as interact/accept.
func _add_wasd_bindings() -> void:
	var pairs := {
		"ui_up": KEY_W, "ui_left": KEY_A, "ui_down": KEY_S, "ui_right": KEY_D,
		"ui_accept": KEY_E,
	}
	for action in pairs:
		var ev := InputEventKey.new()
		ev.physical_keycode = pairs[action]
		if not InputMap.action_has_event(action, ev):
			InputMap.action_add_event(action, ev)


func new_game() -> void:
	flags = {}
	record = 0
	convenience = 0
	current_zone = "west7th"
	return_position = Vector2.ZERO
	Party.reset()
	goto_zone("west7th")


func goto_zone(zone_id: String, at: Vector2 = Vector2.ZERO) -> void:
	current_zone = zone_id
	return_position = at
	get_tree().change_scene_to_file(ZONE_SCENE)


func start_wild_battle(species_id: String, level: int, from_position: Vector2) -> void:
	pending_battle = {"species": species_id, "level": level}
	return_position = from_position
	Party.mark(species_id, "seen")
	get_tree().change_scene_to_file(BATTLE_SCENE)


func end_battle() -> void:
	pending_battle = {}
	get_tree().change_scene_to_file(ZONE_SCENE)


func to_title() -> void:
	get_tree().change_scene_to_file(TITLE_SCENE)
