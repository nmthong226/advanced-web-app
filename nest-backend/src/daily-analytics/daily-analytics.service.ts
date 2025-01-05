import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../tasks/tasks.schema';
import {
  PomodoroLog,
} from '../focus-sessions/pomodoro.schema';

@Injectable()
export class DailyAnalyticsService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    @InjectModel('PomodoroLog')
    private readonly pomodoroLogModel: Model<typeof PomodoroLog>,
  ) {}

  async getCircleChartGroupByTaskStaus(): Promise<{
    [status: string]: number;
  }> {
    const { sunday, saturday } = this.getSundayAndSaturdayOfThisWeek();
    const results = await this.taskModel.aggregate([
      {
        $match: {
          startTime: { $gte: sunday, $lte: saturday },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const taskCounts = results.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return taskCounts;
  }

  async getPomodoroAnalytics(): Promise<{
    weeklyPomodoro: { [date: string]: number };
    activeDays: number;
    totalTimeSpent: number; // Total time spent in minutes for pomodoro sessions
  }> {
    const { sunday, saturday } = this.getSundayAndSaturdayOfThisWeek();

    const results = await this.taskModel.aggregate([
      {
        $match: {
          startTime: { $gte: sunday, $lte: saturday },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
          totalPomodoro: { $sum: '$pomodoro_number' },
        },
      },
    ]);

    const weeklyPomodoro: { [date: string]: number } = {};
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(sunday);
      currentDate.setDate(sunday.getDate() + i);
      const dateString = currentDate.toISOString().split('T')[0];
      weeklyPomodoro[dateString] = 0;
    }

    results.forEach((result) => {
      weeklyPomodoro[result._id] = result.totalPomodoro;
    });

    const timeSpentResult = await this.pomodoroLogModel.aggregate([
      {
        $match: {
          start_time: { $gte: sunday, $lte: saturday },
          session_status: 'pomodoro', // Filter by session_status = 'pomodoro'
        },
      },
      {
        $project: {
          duration: {
            $divide: [
              { $subtract: ['$end_time', '$start_time'] },
              1000 * 60, // Convert milliseconds to minutes
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalTimeSpent: { $sum: '$duration' },
        },
      },
    ]);
    const totalTimeSpent = timeSpentResult.length
      ? timeSpentResult[0].totalTimeSpent
      : 0;

    const activeDays = Object.values(weeklyPomodoro).filter(
      (pomodoro) => pomodoro >= 1,
    ).length;

    return { weeklyPomodoro, activeDays, totalTimeSpent };
  }

  async getWeeklyTaskCounts(): Promise<{ [status: string]: number }> {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const results = await this.taskModel.aggregate([
      {
        $match: {
          startTime: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const weeklyCounts = results.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return weeklyCounts;
  }

  getSundayAndSaturdayOfThisWeek() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Calculate Sunday (start of the week)
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    sunday.setHours(0, 0, 0, 0); // Set time to the start of the day

    // Calculate Saturday (end of the week)
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999); // Set time to the end of the day

    return { sunday, saturday };
  }
}
