import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PomodoroLog } from './pomodoro.schema';

@Injectable()
export class PomodoroLogService {
  constructor(
    @InjectModel('PomodoroLog')
    private readonly pomodoroLogModel: Model<typeof PomodoroLog>,
  ) {}

  async create(createPomodoroLogDto: any) {
    const newLog = new this.pomodoroLogModel(createPomodoroLogDto);
    return newLog.save();
  }

  // Get all pomodoro logs
  async findAll() {
    return this.pomodoroLogModel.find().populate('task_id user_id').exec();
  }

  // Get a specific pomodoro log by ID
  async findOne(id: string) {
    return this.pomodoroLogModel
      .findById(id)
      .populate('task_id user_id')
      .exec();
  }

  // Update a pomodoro log by ID
  async update(id: string, updatePomodoroLogDto: any) {
    return this.pomodoroLogModel
      .findByIdAndUpdate(
        id,
        updatePomodoroLogDto,
        { new: true }, // Return the updated document
      )
      .exec();
  }

  // Delete a pomodoro log by ID
  async delete(id: string) {
    return this.pomodoroLogModel.findByIdAndDelete(id).exec();
  }
}
