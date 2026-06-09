extends Control
## Title screen — the cover of the file.

const PAPER := Color("#d8c89a")
const STAMP_RED := Color("#b3241f")
const DIM := Color("#6d6d78")


func _ready() -> void:
	var bg := ColorRect.new()
	bg.color = Color("#101014")
	bg.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(bg)

	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	add_child(center)

	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 10)
	center.add_child(v)

	var classification := Label.new()
	classification.text = "CLASSIFICATION: CLASSIFIED READER FILE"
	classification.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	classification.add_theme_color_override("font_color", STAMP_RED)
	classification.add_theme_font_size_override("font_size", 12)
	v.add_child(classification)

	var title := Label.new()
	title.text = "THE IRONIC INEPTOCRACY"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_color_override("font_color", PAPER)
	title.add_theme_font_size_override("font_size", 44)
	v.add_child(title)

	var subtitle := Label.new()
	subtitle.text = "THE FILE OPENS"
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	subtitle.add_theme_color_override("font_color", STAMP_RED)
	subtitle.add_theme_font_size_override("font_size", 20)
	v.add_child(subtitle)

	var epigraph := Label.new()
	epigraph.text = "\"The file was never supposed to open cleanly.\""
	epigraph.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	epigraph.add_theme_color_override("font_color", DIM)
	epigraph.add_theme_font_size_override("font_size", 14)
	v.add_child(epigraph)

	v.add_child(_spacer(24))

	var open_btn := Button.new()
	open_btn.text = "OPEN THE FILE"
	open_btn.custom_minimum_size = Vector2(280, 44)
	open_btn.pressed.connect(func(): Game.new_game())
	v.add_child(open_btn)
	open_btn.grab_focus.call_deferred()

	if SaveSystem.has_save():
		var resume := Button.new()
		resume.text = "RESUME — the record holds"
		resume.custom_minimum_size = Vector2(280, 44)
		resume.pressed.connect(func(): SaveSystem.load_game())
		v.add_child(resume)

	var quit := Button.new()
	quit.text = "CLOSE THE FILE"
	quit.custom_minimum_size = Vector2(280, 44)
	quit.pressed.connect(func(): get_tree().quit())
	v.add_child(quit)

	v.add_child(_spacer(24))

	var footer := Label.new()
	footer.text = "Based on the novel by Dillon Mohr · This is a work of fiction."
	footer.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	footer.add_theme_color_override("font_color", Color("#44444e"))
	footer.add_theme_font_size_override("font_size", 11)
	v.add_child(footer)


func _spacer(h: int) -> Control:
	var s := Control.new()
	s.custom_minimum_size = Vector2(0, h)
	return s
