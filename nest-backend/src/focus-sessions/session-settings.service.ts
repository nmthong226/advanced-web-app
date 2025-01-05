import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SessionSettings } from './pomodoro.schema';

@Injectable()
export class SessionSettingsService {
  constructor(
    @InjectModel('SessionSettings')
    private sessionSettingsModel: Model<typeof SessionSettings>,
  ) {}

  async findAllSessionSettings() {
    return this.sessionSettingsModel.find();
  }

  async createSessionSettings(user_id, data) {
    const sessionSettings = new this.sessionSettingsModel({
      user_id,
      default_work_time: data.default_work_time,
      default_break_time: data.default_break_time,
      long_break_time: data.long_break_time,
      cycles_per_set: data.cycles_per_set,
    });
    return sessionSettings.save();
  }

  async updateSessionSettings(user_id, data) {
    return this.sessionSettingsModel.findOneAndUpdate(
      { user_id },
      {
        $set: {
          default_work_time: data.default_work_time,
          default_break_time: data.default_break_time,
          long_break_time: data.long_break_time,
          cycles_per_set: data.cycles_per_set,
        },
      },
      { new: true },
    );
  }
}
