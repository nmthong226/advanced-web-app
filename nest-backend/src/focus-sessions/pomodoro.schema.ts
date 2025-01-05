import mongoose from 'mongoose';

export const PomodoroLogSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Task',
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  session_status: {
    type: String,
    enum: ['pomodoro', 'short-break', 'long-break'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const SessionSettingsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  default_work_time: {
    type: Number,
    required: true,
  },
  default_break_time: {
    type: Number,
    required: true,
  },
  long_break_time: {
    type: Number,
    required: true,
  },
  cycles_per_set: {
    type: Number,
    required: true,
  },
});

export const CurrentPomodoroSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  current_pomodoro_number: {
    type: Number,
    required: true,
  },
  cycles_completed: {
    type: Number,
    required: true,
  },
  total_break_time: {
    type: Number, // seconds
    required: true,
  },
  number_sessions: {
    type: Number,
    required: true,
  },
});

export const PomodoroDetailsSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Task',
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
});

const PomodoroLog = mongoose.model(
  'PomodoroLog',
  PomodoroLogSchema,
);const SessionSettings = mongoose.model(
  'SessionSettings',
  SessionSettingsSchema,
);
const CurrentPomodoro = mongoose.model(
  'CurrentPomodoro',
  CurrentPomodoroSchema,
);
const PomodoroDetails = mongoose.model(
  'PomodoroDetails',
  PomodoroDetailsSchema,
);

export { PomodoroLog, SessionSettings, CurrentPomodoro, PomodoroDetails };
