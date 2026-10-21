extends Control
## Battle — a turn-based Argument against a wild Manifestation.
## Commands: ARGUE (tactics) / FILE (capture) / SWAP / WITHDRAW.
## Reads Game.pending_battle; all numbers come from JSON data.

signal command_chosen(cmd: Dictionary)

const PAPER := Color("#d8c89a")
const STAMP_RED := Color("#b3241f")
const DIM := Color("#6d6d78")

var enemy: Manifest
var ally: Manifest
var log_label: Label
var menu_box: HBoxContainer
var moves_box: VBoxContainer
var enemy_info: Label
var enemy_bar: ProgressBar
var ally_info: Label
var ally_bar: ProgressBar
var enemy_sprite: Panel
var ally_sprite: Panel
var ramp := {}   # instance -> {move_id, count}


func _ready() -> void:
	var info: Dictionary = Game.pending_battle
	enemy = Manifest.create(info.get("species", "rumor"), int(info.get("level", 3)))
	ally = Party.first_healthy()
	if ally == null:
		Game.end_battle()
		return
	_build_ui()
	_run_battle()


# ---------------------------------------------------------------- UI

func _build_ui() -> void:
	set_anchors_preset(Control.PRESET_FULL_RECT)
	var bg := ColorRect.new()
	bg.color = Color("#101014")
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var grain := ColorRect.new()  # fluorescent strip, the only light source
	grain.color = Color("#cfc4a210")
	grain.position = Vector2(0, 40)
	grain.size = Vector2(960, 6)
	add_child(grain)

	enemy_sprite = _make_sprite(enemy, Vector2(620, 90))
	add_child(enemy_sprite)
	enemy_info = Label.new()
	enemy_info.position = Vector2(48, 60)
	enemy_info.add_theme_color_override("font_color", PAPER)
	enemy_info.add_theme_font_size_override("font_size", 16)
	add_child(enemy_info)
	enemy_bar = _make_bar(Vector2(48, 92))
	add_child(enemy_bar)

	ally_sprite = _make_sprite(ally, Vector2(140, 250))
	add_child(ally_sprite)
	ally_info = Label.new()
	ally_info.position = Vector2(560, 280)
	ally_info.add_theme_color_override("font_color", PAPER)
	ally_info.add_theme_font_size_override("font_size", 16)
	add_child(ally_info)
	ally_bar = _make_bar(Vector2(560, 312))
	add_child(ally_bar)

	log_label = Label.new()
	log_label.position = Vector2(48, 380)
	log_label.size = Vector2(860, 60)
	log_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	log_label.add_theme_color_override("font_color", PAPER)
	log_label.add_theme_font_size_override("font_size", 15)
	add_child(log_label)

	menu_box = HBoxContainer.new()
	menu_box.position = Vector2(48, 460)
	menu_box.add_theme_constant_override("separation", 12)
	add_child(menu_box)
	for cmd in ["ARGUE", "FILE", "SWAP", "WITHDRAW"]:
		var b := Button.new()
		b.text = cmd
		b.custom_minimum_size = Vector2(140, 40)
		b.pressed.connect(_on_menu.bind(cmd))
		menu_box.add_child(b)

	moves_box = VBoxContainer.new()
	moves_box.position = Vector2(48, 430)
	moves_box.visible = false
	add_child(moves_box)
	_refresh()


func _make_sprite(m: Manifest, pos: Vector2) -> Panel:
	var p := Panel.new()
	p.position = pos
	p.size = Vector2(150, 150)
	var style := StyleBoxFlat.new()
	style.bg_color = Color("#1a1a22")
	style.border_color = Color(m.species().get("color", "#cfc4a2"))
	style.set_border_width_all(2)
	p.add_theme_stylebox_override("panel", style)
	var glyph := Label.new()
	glyph.text = String(m.species().get("glyph", "???"))
	glyph.set_anchors_preset(Control.PRESET_FULL_RECT)
	glyph.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	glyph.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	glyph.add_theme_font_size_override("font_size", 40)
	glyph.add_theme_color_override("font_color", Color(m.species().get("color", "#cfc4a2")))
	p.add_child(glyph)
	var aff := Label.new()
	aff.text = " / ".join(m.species().get("affinities", []))
	aff.position = Vector2(0, 152)
	aff.add_theme_font_size_override("font_size", 11)
	aff.add_theme_color_override("font_color", DIM)
	p.add_child(aff)
	return p


func _make_bar(pos: Vector2) -> ProgressBar:
	var bar := ProgressBar.new()
	bar.position = pos
	bar.size = Vector2(300, 14)
	bar.show_percentage = false
	var fill := StyleBoxFlat.new()
	fill.bg_color = STAMP_RED
	bar.add_theme_stylebox_override("fill", fill)
	var back := StyleBoxFlat.new()
	back.bg_color = Color("#26262e")
	bar.add_theme_stylebox_override("background", back)
	return bar


func _refresh() -> void:
	enemy_info.text = "%s  Lv.%d" % [enemy.display_name(), enemy.level]
	enemy_bar.max_value = enemy.max_resolve()
	enemy_bar.value = enemy.resolve
	ally_info.text = "%s  Lv.%d   %d/%d" % [ally.display_name(), ally.level, ally.resolve, ally.max_resolve()]
	ally_bar.max_value = ally.max_resolve()
	ally_bar.value = ally.resolve


func _log(text: String) -> void:
	log_label.text = text


func _pause(secs := 1.1) -> void:
	await get_tree().create_timer(secs).timeout


# ---------------------------------------------------------------- input

func _on_menu(cmd: String) -> void:
	match cmd:
		"ARGUE":
			_show_moves()
		"FILE":
			command_chosen.emit({"type": "file"})
		"SWAP":
			_show_swap()
		"WITHDRAW":
			command_chosen.emit({"type": "run"})


func _show_moves() -> void:
	menu_box.visible = false
	moves_box.visible = true
	for c in moves_box.get_children():
		c.queue_free()
	for mid in ally.known_moves():
		var mv: Dictionary = DataStore.moves[mid]
		var b := Button.new()
		b.text = "%s  [%s]  %s" % [mv["name"], mv["type"], mv.get("desc", "")]
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.pressed.connect(func(): command_chosen.emit({"type": "move", "move_id": mid}))
		moves_box.add_child(b)
	var back := Button.new()
	back.text = "← BACK"
	back.pressed.connect(func():
		moves_box.visible = false
		menu_box.visible = true)
	moves_box.add_child(back)


func _show_swap() -> void:
	menu_box.visible = false
	moves_box.visible = true
	for c in moves_box.get_children():
		c.queue_free()
	for i in Party.members.size():
		var m: Manifest = Party.members[i]
		var b := Button.new()
		b.text = "%s Lv.%d  %d/%d%s" % [m.display_name(), m.level, m.resolve, m.max_resolve(),
			"  (DISCREDITED)" if m.is_discredited() else ""]
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.disabled = m.is_discredited() or m == ally
		b.pressed.connect(func(): command_chosen.emit({"type": "swap", "index": i}))
		moves_box.add_child(b)
	var back := Button.new()
	back.text = "← BACK"
	back.pressed.connect(func():
		moves_box.visible = false
		menu_box.visible = true)
	moves_box.add_child(back)


func _await_command() -> Dictionary:
	menu_box.visible = true
	moves_box.visible = false
	var cmd: Dictionary = await command_chosen
	menu_box.visible = false
	moves_box.visible = false
	return cmd


# ---------------------------------------------------------------- flow

func _run_battle() -> void:
	menu_box.visible = false
	_log("A wild %s manifests. The pressure thickens." % enemy.display_name())
	await _pause()
	_log("\"%s\"" % String(enemy.species().get("epigraph", "")))
	await _pause(1.6)

	while true:
		_refresh()
		var cmd := await _await_command()
		match cmd["type"]:
			"run":
				_log("You withdraw. The network survives by knowing when to leave.")
				await _pause()
				break
			"swap":
				ally.reset_stages()
				ally = Party.members[cmd["index"]]
				_swap_sprite()
				_log("You depose %s." % ally.display_name())
				await _pause()
				if await _enemy_turn():
					break
			"file":
				var done: bool = await _attempt_filing()
				if done:
					break
				if await _enemy_turn():
					break
			"move":
				if await _exchange(cmd["move_id"]):
					break
		_refresh()

	enemy.reset_stages()
	ally.reset_stages()
	await _pause(0.6)
	Game.end_battle()


func _swap_sprite() -> void:
	var pos := ally_sprite.position
	ally_sprite.queue_free()
	ally_sprite = _make_sprite(ally, pos)
	add_child(ally_sprite)
	_refresh()


## Both sides act, ordered by priority then Tempo. Returns true if battle ended.
func _exchange(player_move_id: String) -> bool:
	var enemy_move_id := _enemy_pick()
	var p_first := _player_acts_first(player_move_id, enemy_move_id)
	var order := [[ally, enemy, player_move_id], [enemy, ally, enemy_move_id]] if p_first \
		else [[enemy, ally, enemy_move_id], [ally, enemy, player_move_id]]
	for step in order:
		if step[0].is_discredited():
			continue
		await _use_move(step[0], step[1], step[2])
		_refresh()
		if enemy.is_discredited():
			return await _on_victory()
		if ally.is_discredited():
			if not await _on_ally_discredited():
				return true
	return false


func _player_acts_first(pm: String, em: String) -> bool:
	var pp: bool = DataStore.moves[pm].get("priority", false)
	var ep: bool = DataStore.moves[em].get("priority", false)
	if pp != ep:
		return pp
	if ally.battle_stat("tempo") == enemy.battle_stat("tempo"):
		return randf() < 0.5
	return ally.battle_stat("tempo") > enemy.battle_stat("tempo")


func _enemy_pick() -> String:
	var known := enemy.known_moves()
	return known[randi() % known.size()]


func _use_move(user: Manifest, target: Manifest, move_id: String) -> void:
	var mv: Dictionary = DataStore.moves[move_id]
	var who := "Your %s" % user.display_name() if user == ally else "The wild %s" % user.display_name()
	_log("%s uses %s." % [who, mv["name"]])
	await _pause()

	var acc := float(mv.get("accuracy", 100))
	if acc < 200 and randf() * 100.0 > acc:
		_log("It misses. The room pretends not to notice.")
		await _pause()
		_track_ramp(user, "")
		return

	match mv.get("kind", "attack"):
		"attack":
			await _apply_attack(user, target, move_id, mv)
		"heal":
			var amount := int(user.max_resolve() * float(mv.get("percent", 0.5)))
			user.resolve = mini(user.resolve + amount, user.max_resolve())
			_log("%s restores %d Resolve." % [who, amount])
			await _pause()
		"status":
			for ch in mv.get("stat_changes", []):
				var subject: Manifest = user if ch.get("target") == "self" else target
				_apply_stage(subject, String(ch["stat"]), int(ch["stages"]))
			await _pause()


func _apply_attack(user: Manifest, target: Manifest, move_id: String, mv: Dictionary) -> void:
	var power := float(mv.get("power", 40))
	power = _ramped_power(user, move_id, power, mv)
	var atk := user.battle_stat("pressure")
	var def: float
	if mv.get("ignore_def_buffs", false) and target.stages.get("insulation", 0) > 0:
		def = float(target.stat("insulation"))
	else:
		def = target.battle_stat("insulation")
	var stab := 1.5 if mv["type"] in user.species().get("affinities", []) else 1.0
	var eff := DataStore.effectiveness(mv["type"], target.species().get("affinities", []))
	var dmg := int(((2.0 * user.level / 5.0 + 2.0) * power * atk / maxf(def, 1.0)) / 50.0 + 2.0)
	dmg = int(dmg * stab * eff * randf_range(0.85, 1.0))
	dmg = maxi(dmg, 1)
	target.resolve = maxi(target.resolve - dmg, 0)
	_refresh()
	if eff > 1.0:
		_log("It lands where the file is thin. (%d)" % dmg)
	elif eff < 1.0:
		_log("The room absorbs most of it. (%d)" % dmg)
	else:
		_log("It connects. (%d)" % dmg)
	await _pause()
	var recoil := float(mv.get("recoil", 0.0))
	if recoil > 0.0:
		var rd := maxi(int(dmg * recoil), 1)
		user.resolve = maxi(user.resolve - rd, 0)
		_log("The cost is shared downward. (%d recoil)" % rd)
		await _pause()
	if mv.get("clear_stages", false):
		user.reset_stages()
		target.reset_stages()
		_log("All adjustments vanish from the record.")
		await _pause()
	var ohs: Dictionary = mv.get("on_hit_stat", {})
	if not ohs.is_empty() and randf() < float(ohs.get("chance", 1.0)):
		var subject: Manifest = user if ohs.get("target") == "self" else target
		_apply_stage(subject, String(ohs["stat"]), int(ohs["stages"]))
		await _pause()


func _ramped_power(user: Manifest, move_id: String, power: float, mv: Dictionary) -> float:
	var ramp_step := float(mv.get("ramp", 0))
	if ramp_step <= 0:
		_track_ramp(user, move_id)
		return power
	var entry: Dictionary = ramp.get(user, {"move_id": "", "count": 0})
	var count: int = entry["count"] + 1 if entry["move_id"] == move_id else 0
	ramp[user] = {"move_id": move_id, "count": count}
	return minf(power + ramp_step * count, float(mv.get("ramp_max", power * 3)))


func _track_ramp(user: Manifest, move_id: String) -> void:
	ramp[user] = {"move_id": move_id, "count": 0}


func _apply_stage(subject: Manifest, stat: String, stages: int) -> void:
	subject.stages[stat] = clampi(subject.stages.get(stat, 0) + stages, -6, 6)
	var who := "Your %s" % subject.display_name() if subject == ally else "The wild %s" % subject.display_name()
	var dir := "rises" if stages > 0 else "falls"
	var degree := " sharply" if absi(stages) >= 2 else ""
	_log("%s's %s %s%s." % [who, stat.capitalize(), dir, degree])


func _enemy_turn() -> bool:
	await _use_move(enemy, ally, _enemy_pick())
	_refresh()
	if ally.is_discredited():
		return not await _on_ally_discredited()
	return false


## Returns true if the player can continue (another healthy member exists).
func _on_ally_discredited() -> bool:
	_log("Your %s is discredited. The machine spins it; it does not die." % ally.display_name())
	await _pause(1.4)
	var next := Party.first_healthy()
	if next == null:
		_log("All your evidence is discredited. The network pulls you out and patches the folder.")
		await _pause(1.8)
		Party.heal_all()
		return false
	ally = next
	_swap_sprite()
	_log("You depose %s." % ally.display_name())
	await _pause()
	return true


func _on_victory() -> bool:
	_log("The wild %s loses the room." % enemy.display_name())
	await _pause()
	var logs := ally.gain_xp(enemy.level * 14)
	ally.bond += 1
	for line in logs:
		_log(line)
		await _pause()
	return true


## Returns true if the battle ended (successful filing).
func _attempt_filing() -> bool:
	if not Party.use_item("blank_affidavit"):
		_log("No blank affidavits left. A fact with no paperwork is just a rumor.")
		await _pause(1.4)
		return false
	var rate := float(DataStore.items["blank_affidavit"].get("rate", 1.0))
	var frac := float(enemy.resolve) / float(enemy.max_resolve())
	var chance := clampf(0.3 * (1.7 - 1.4 * frac) * rate, 0.05, 0.95)
	_log("You raise the affidavit. The %s flickers between existing and being deniable…" % enemy.display_name())
	await _pause(1.5)
	if randf() < chance:
		var kept := Party.add_member(Manifest.create(enemy.species_id, enemy.level))
		enemy.resolve = 0
		_refresh()
		_log("FILED. %s enters the dossier.%s" % [enemy.display_name(),
			"" if kept else " (Party full — sent to deep storage.)"])
		await _pause(1.4)
		_log("\"%s\"" % String(enemy.species().get("epigraph", "")))
		await _pause(2.0)
		return true
	_log("It slips the paperwork. Plausible deniability holds.")
	await _pause(1.2)
	return false
