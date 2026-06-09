class_name DialogueBox
extends CanvasLayer
## Dossier-styled dialogue UI, built in code. Supports linear lines (with
## canon-source tags) and choice prompts. Use with await:
##   var box := DialogueBox.new(); add_child(box)
##   await box.run_lines(lines)
##   var idx: int = await box.ask("Prompt?", ["A", "B", "C"])
##   box.queue_free()

signal advanced
signal chose(index: int)

const PAPER := Color("#d8c89a")
const INK := Color("#101014")
const STAMP_RED := Color("#b3241f")

var _panel: PanelContainer
var _speaker_label: Label
var _text_label: Label
var _source_label: Label
var _hint_label: Label
var _options_box: VBoxContainer
var _awaiting_advance := false


func _ready() -> void:
	layer = 90
	_panel = PanelContainer.new()
	var style := StyleBoxFlat.new()
	style.bg_color = Color("#15151aef")
	style.border_color = PAPER
	style.set_border_width_all(1)
	style.set_content_margin_all(14)
	_panel.add_theme_stylebox_override("panel", style)
	_panel.set_anchors_preset(Control.PRESET_BOTTOM_WIDE)
	_panel.offset_left = 24
	_panel.offset_right = -24
	_panel.offset_top = -150
	_panel.offset_bottom = -16
	add_child(_panel)

	var v := VBoxContainer.new()
	_panel.add_child(v)

	var top := HBoxContainer.new()
	v.add_child(top)
	_speaker_label = Label.new()
	_speaker_label.add_theme_color_override("font_color", STAMP_RED)
	_speaker_label.add_theme_font_size_override("font_size", 13)
	top.add_child(_speaker_label)
	var spacer := Control.new()
	spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top.add_child(spacer)
	_source_label = Label.new()
	_source_label.add_theme_color_override("font_color", Color("#6d6d78"))
	_source_label.add_theme_font_size_override("font_size", 11)
	top.add_child(_source_label)

	_text_label = Label.new()
	_text_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	_text_label.add_theme_color_override("font_color", PAPER)
	_text_label.add_theme_font_size_override("font_size", 16)
	_text_label.custom_minimum_size = Vector2(0, 56)
	v.add_child(_text_label)

	_options_box = VBoxContainer.new()
	v.add_child(_options_box)

	_hint_label = Label.new()
	_hint_label.text = "▼ ENTER"
	_hint_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	_hint_label.add_theme_color_override("font_color", Color("#6d6d78"))
	_hint_label.add_theme_font_size_override("font_size", 11)
	v.add_child(_hint_label)


func _unhandled_input(event: InputEvent) -> void:
	if _awaiting_advance and event.is_action_pressed("ui_accept"):
		get_viewport().set_input_as_handled()
		_awaiting_advance = false
		advanced.emit()


## lines: Array of {speaker, text, source}
func run_lines(lines: Array) -> void:
	_options_box.visible = false
	_hint_label.visible = true
	for line in lines:
		_speaker_label.text = String(line.get("speaker", ""))
		_text_label.text = String(line.get("text", ""))
		_source_label.text = "FROM THE FILE" if line.get("source", "") == "canon" else ""
		await _type_on(_text_label.text)
		_awaiting_advance = true
		await advanced


## Type-on effect matching the site's terminal cadence (28ms/char, capped).
func _type_on(full_text: String) -> void:
	var step := maxi(1, full_text.length() / 90)
	var i := 0
	while i < full_text.length():
		i += step
		_text_label.text = full_text.substr(0, i)
		await get_tree().create_timer(0.014).timeout
	_text_label.text = full_text


func ask(prompt: String, options: Array) -> int:
	_speaker_label.text = ""
	_source_label.text = ""
	_text_label.text = prompt
	_hint_label.visible = false
	_options_box.visible = true
	for c in _options_box.get_children():
		c.queue_free()
	for i in options.size():
		var b := Button.new()
		b.text = String(options[i])
		b.alignment = HORIZONTAL_ALIGNMENT_LEFT
		b.pressed.connect(func(): chose.emit(i))
		_options_box.add_child(b)
		if i == 0:
			b.grab_focus.call_deferred()
	var idx: int = await chose
	_options_box.visible = false
	return idx
