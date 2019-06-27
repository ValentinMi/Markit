const { Note, validate } = require("../models/note");
const auth = require("../middlewares/auth");
// const admin = require("../middleware/admin");
const moment = require("moment");
const express = require("express");
const router = express.Router();

// GET ALL NOTES
router.get("/", async (req, res) => {
  const notes = await Note.find()
    .select("-__v -user")
    .sort("date");

  // Send notes to client
  res.send(notes);
});

// GET ALL NOTES FROM AN USERID
router.get("/mine", [auth], async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort("date");

  res.send(notes);
});

// GET THIS WEEK NOTES FROM AN USER
router.get("/mine/day", [auth], async (req, res) => {
  const daysNote = await Note.find({
    user: req.user._id,
    date
  });
});

// POST NEW NOTE
router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const note = new Note({
    value: req.body.value,
    date: moment().toJSON(),
    user: req.user._id
  });
  await note.save();

  res.send(note);
});

// UPDATE NOTE
router.put("/:id", [auth], async (req, res) => {
  const { error } = validate(res.body);
  if (error) return res.status(400).send("Invalid note");

  const note = await Note.findByIdAndUpdate(
    req.params.id,
    {
      note: req.body.note
    },
    { new: true }
  ).select("-password");

  if (!note)
    return res.status(404).send("The note with the given ID was not found.");
  res.send(note);
});

module.exports = router;
