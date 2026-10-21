extends Node2D
## Zone — builds an explorable pressure map entirely from data/zones/<id>.json.
## "The map is not geography. It is pressure."

var zone_def: Dictionary = {}
var player: Player
var patches: Array = []        # [{rect: Rect2, rate: float, table: Array}]
var npcs: Array = []           # [{pos: Vector2, name, dialogue, node}]
var exits: Array = []          # [{rect: Rect2, message}]
var step_accum := 0.0
var busy := false              # dialogue/cutscene lock
var hud_status: Label


func _ready() -> void:
	zone_def = DataStore.zones.get(Game.current_zone, {})
	if zone_def.is_empty():
		push_error("Unknown zone: " + Game.current_zone)
		Game.to_title()
		return
	_build_world()
	_build_hud()
	_spawn_player()
	if not Game.flags.get("prologue_done", false) and Game.current_zone == "west7th":
		await _run_prologue()


func _build_world() -> void:
	var size: Array = zone_def.get("size", [960, 544])
	var bg := ColorRect.new()
	bg.color = Color(zone_def.get("bg_color", "#131318"))
	bg.size = Vector2(size[0], size[1])
	add_child(bg)

	for d in zone_def.get("decals", []):
		var r: Array = d["rect"]
		var c := ColorRect.new()
		c.color = Color(d.get("color", "#1d1d24"))
		c.position = Vector2(r[0], r[1])
		c.size = Vector2(r[2], r[3])
		add_child(c)

	for p in zone_def.get("patches", []):
		var r: Array = p["rect"]
		var c := ColorRect.new()
		c.color = Color(p.get("color", "#2a2a36"))
		c.position = Vector2(r[0], r[1])
		c.size = Vector2(r[2], r[3])
		add_child(c)
		patches.append({
			"rect": Rect2(r[0], r[1], r[2], r[3]),
			"rate": float(p.get("encounter_rate", 0.1)),
			"table": p.get("table", []),
		})

	for w in zone_def.get("walls", []):
		var r: Array = w["rect"]
		var body := StaticBody2D.new()
		var shape := CollisionShape2D.new()
		var rect := RectangleShape2D.new()
		rect.size = Vector2(r[2], r[3])
		shape.shape = rect
		shape.position = Vector2(r[2] / 2.0, r[3] / 2.0)
		body.position = Vector2(r[0], r[1])
		body.add_child(shape)
		if w.has("color"):
			var visual := ColorRect.new()
			visual.color = Color(w["color"])
			visual.size = Vector2(r[2], r[3])
			body.add_child(visual)
		if w.has("label"):
			var lbl := Label.new()
			lbl.text = String(w["label"])
			lbl.position = Vector2(10, 8)
			lbl.add_theme_color_override("font_color", Color("#6d6d78"))
			lbl.add_theme_font_size_override("font_size", 12)
			body.add_child(lbl)
		add_child(body)

	for n in zone_def.get("npcs", []):
		var req: String = n.get("requires_flag", "")
		var node := Node2D.new()
		node.position = Vector2(n["pos"][0], n["pos"][1])
		var v := ColorRect.new()
		v.color = Color(n.get("color", "#cfc4a2"))
		v.size = Vector2(22, 22)
		v.position = Vector2(-11, -11)
		node.add_child(v)
		var tag := Label.new()
		tag.text = String(n.get("name", ""))
		tag.position = Vector2(-40, -34)
		tag.add_theme_font_size_override("font_size", 11)
		tag.add_theme_color_override("font_color", Color("#9a9aa6"))
		node.add_child(tag)
		var blocker := StaticBody2D.new()
		var bshape := CollisionShape2D.new()
		var brect := RectangleShape2D.new()
		brect.size = Vector2(22, 22)
		bshape.shape = brect
		blocker.add_child(bshape)
		node.add_child(blocker)
		add_child(node)
		node.visible = req == "" or Game.flags.get(req, false)
		npcs.append({
			"pos": node.position, "name": n.get("name", ""),
			"dialogue": n.get("dialogue", ""), "node": node,
			"requires_flag": req,
		})

	for e in zone_def.get("exits", []):
		var r: Array = e["rect"]
		exits.append({
			"rect": Rect2(r[0], r[1], r[2], r[3]),
			"to": e.get("to"), "message": e.get("message", ""),
		})


func _build_hud() -> void:
	var hud := CanvasLayer.new()
	hud.layer = 10
	add_child(hud)
	var name_lbl := Label.new()
	name_lbl.text = "%s\n%s" % [zone_def.get("name", ""), zone_def.get("subtitle", "")]
	name_lbl.position = Vector2(16, 12)
	name_lbl.add_theme_color_override("font_color", Color("#d8c89a"))
	name_lbl.add_theme_font_size_override("font_size", 14)
	hud.add_child(name_lbl)
	hud_status = Label.new()
	hud_status.position = Vector2(16, 60)
	hud_status.add_theme_color_override("font_color", Color("#6d6d78"))
	hud_status.add_theme_font_size_override("font_size", 11)
	hud.add_child(hud_status)
	_refresh_status()
	var hint := Label.new()
	hint.text = "ARROWS/WASD move · E/ENTER interact · F5 notarize (save) · ESC title"
	hint.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
	hint.position = Vector2(16, 520)
	hint.add_theme_color_override("font_color", Color("#44444e"))
	hint.add_theme_font_size_override("font_size", 11)
	hud.add_child(hint)


func _refresh_status() -> void:
	var lead := Party.first_healthy()
	var lead_text := "—"
	if lead != null:
		lead_text = "%s Lv.%d  %d/%d" % [lead.display_name(), lead.level, lead.resolve, lead.max_resolve()]
	hud_status.text = "FILED: %d   EVIDENCE: %s   AFFIDAVITS: %d" % [
		Party.filed_count(), lead_text, int(Party.items.get("blank_affidavit", 0))]


func _spawn_player() -> void:
	player = Player.new()
	var spawn: Array = zone_def.get("player_spawn", [100, 100])
	player.global_position = Game.return_position if Game.return_position != Vector2.ZERO \
		else Vector2(spawn[0], spawn[1])
	Game.return_position = Vector2.ZERO
	player.moved.connect(_on_player_moved)
	add_child(player)


func _on_player_moved(distance: float) -> void:
	if busy or Party.first_healthy() == null:
		return
	for p in patches:
		if p["rect"].has_point(player.global_position):
			step_accum += distance
			if step_accum >= 28.0:
				step_accum = 0.0
				if randf() < p["rate"]:
					_trigger_encounter(p["table"])
			return
	step_accum = 0.0


func _trigger_encounter(table: Array) -> void:
	busy = true
	player.input_enabled = false
	var total := 0
	for e in table:
		total += int(e.get("weight", 1))
	var roll := randi() % maxi(total, 1)
	var chosen: Dictionary = table[0]
	for e in table:
		roll -= int(e.get("weight", 1))
		if roll < 0:
			chosen = e
			break
	var lv_range: Array = chosen.get("levels", [3, 5])
	var level := randi_range(int(lv_range[0]), int(lv_range[1]))
	Game.start_wild_battle(chosen["species"], level, player.global_position)


func _unhandled_input(event: InputEvent) -> void:
	if busy:
		return
	if event.is_action_pressed("ui_accept"):
		_try_interact()
	elif event is InputEventKey and event.pressed and event.keycode == KEY_F5:
		SaveSystem.save_game(player.global_position)
		_toast("NOTARIZED. The record holds, for now.")
	elif event.is_action_pressed("ui_cancel"):
		Game.to_title()


func _try_interact() -> void:
	for n in npcs:
		if not n["node"].visible:
			continue
		if player.global_position.distance_to(n["pos"]) < 42.0:
			_open_dialogue(n["dialogue"])
			return
	for e in exits:
		if e["rect"].grow(16).has_point(player.global_position):
			if e["to"] == null:
				_toast(String(e["message"]))
			else:
				Game.goto_zone(String(e["to"]))
			return


func _open_dialogue(dialogue_id: String) -> void:
	var d: Dictionary = DataStore.dialogues.get(dialogue_id, {})
	if d.is_empty():
		return
	busy = true
	player.input_enabled = false
	var box := DialogueBox.new()
	add_child(box)
	await box.run_lines(d.get("lines", []))
	box.queue_free()
	busy = false
	player.input_enabled = true
	_refresh_status()


func _toast(text: String) -> void:
	busy = true
	player.input_enabled = false
	var box := DialogueBox.new()
	add_child(box)
	await box.run_lines([{"speaker": "", "text": text, "source": "adaptation"}])
	box.queue_free()
	busy = false
	player.input_enabled = true


## Opening cutscene: the leak, then the starter choice.
func _run_prologue() -> void:
	busy = true
	player.input_enabled = false
	var box := DialogueBox.new()
	add_child(box)
	await box.run_lines(DataStore.dialogues["leak"]["lines"])

	var prompt: Dictionary = DataStore.dialogues["starter_prompt"]
	var labels := []
	for o in prompt["options"]:
		labels.append("%s — %s" % [o["label"], o["blurb"]])
	var idx: int = await box.ask(String(prompt["prompt"]), labels)
	var species_id: String = prompt["options"][idx]["species"]
	Party.add_member(Manifest.create(species_id, 5))

	await box.run_lines(DataStore.dialogues["starter_done"]["lines"])
	box.queue_free()

	Game.flags["prologue_done"] = true
	Game.flags["starter_chosen"] = true
	for n in npcs:
		if n["requires_flag"] != "":
			n["node"].visible = Game.flags.get(n["requires_flag"], false)
	busy = false
	player.input_enabled = true
	_refresh_status()
