class_name Player
extends CharacterBody2D
## The Courier. Free 4/8-direction movement; visuals are placeholder geometry
## (see art direction doc for sprite prompts).

signal moved(distance: float)

const SPEED := 150.0

var input_enabled := true


func _ready() -> void:
	var shape := CollisionShape2D.new()
	var rect := RectangleShape2D.new()
	rect.size = Vector2(20, 20)
	shape.shape = rect
	add_child(shape)

	var body := ColorRect.new()
	body.color = Color("#e0a33c")
	body.size = Vector2(22, 22)
	body.position = Vector2(-11, -11)
	add_child(body)

	var folder := ColorRect.new()  # the file, carried like groceries
	folder.color = Color("#d8c89a")
	folder.size = Vector2(10, 7)
	folder.position = Vector2(-5, -2)
	add_child(folder)

	var cam := Camera2D.new()
	cam.enabled = true
	cam.zoom = Vector2(1.4, 1.4)
	add_child(cam)


func _physics_process(delta: float) -> void:
	if not input_enabled:
		velocity = Vector2.ZERO
		return
	var dir := Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")
	velocity = dir * SPEED
	var before := global_position
	move_and_slide()
	var dist := global_position.distance_to(before)
	if dist > 0.1:
		moved.emit(dist)
