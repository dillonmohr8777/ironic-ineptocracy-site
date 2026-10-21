extends Node
## Headless smoke test. Run with:
##   godot --headless --path game/godot tests/Smoke.tscn
## Exercises stats, the type chart, party serialization, zone construction,
## and one live battle exchange. Prints SMOKE PASS / SMOKE FAIL.

var failures := []


func _ready() -> void:
	await _run()


func _check(cond: bool, label: String) -> void:
	if cond:
		print("  ok: " + label)
	else:
		failures.append(label)
		print("  FAIL: " + label)


func _run() -> void:
	print("smoke: data")
	_check(DataStore.validate().is_empty(), "data cross-references valid")
	_check(absf(DataStore.effectiveness("WITNESS", ["MONEY"]) - 2.0) < 0.001, "WITNESS beats MONEY (receipts)")
	_check(absf(DataStore.effectiveness("MEMORY", ["WITNESS"]) - 0.5) < 0.001, "WITNESS resists MEMORY (checksum)")

	print("smoke: manifest")
	var m := Manifest.create("receipt", 7)
	_check(m.max_resolve() > 0 and m.resolve == m.max_resolve(), "resolve initialized")
	_check(m.known_moves().has("follow_receipts"), "learnset includes level-7 signature")
	var logs := m.gain_xp(1000)
	_check(m.level > 7 and logs.size() > 0, "xp levels up")

	print("smoke: party round-trip")
	Party.reset()
	Party.add_member(Manifest.create("checksum", 5))
	var snapshot := Party.serialize()
	Party.deserialize(snapshot)
	_check(Party.members.size() == 1 and Party.members[0].species_id == "checksum", "serialize/deserialize")
	_check(Party.dossier.get("checksum", "") == "filed", "dossier marks filed")

	print("smoke: zone builds")
	Game.flags = {"prologue_done": true, "starter_chosen": true}
	Game.current_zone = "west7th"
	var zone: Node2D = load("res://scenes/Zone.tscn").instantiate()
	add_child(zone)
	await get_tree().process_frame
	await get_tree().process_frame
	_check(zone.player != null, "player spawned")
	_check(zone.patches.size() == 3, "pressure patches built")
	zone.queue_free()
	await get_tree().process_frame

	print("smoke: battle exchange")
	Game.pending_battle = {"species": "rumor", "level": 3}
	var battle: Control = load("res://scenes/Battle.tscn").instantiate()
	add_child(battle)
	await get_tree().create_timer(3.5).timeout  # intro logs
	var enemy_max: int = battle.enemy.max_resolve()
	battle.command_chosen.emit({"type": "move", "move_id": battle.ally.known_moves()[0]})
	await get_tree().create_timer(6.0).timeout
	_check(battle.enemy.resolve < enemy_max or battle.ally.resolve < battle.ally.max_resolve(),
		"an exchange dealt damage")

	if failures.is_empty():
		print("SMOKE PASS")
		get_tree().quit(0)
	else:
		print("SMOKE FAIL: " + str(failures))
		get_tree().quit(1)
