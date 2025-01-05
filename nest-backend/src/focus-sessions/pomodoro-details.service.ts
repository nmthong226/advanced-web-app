import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PomodoroDetails } from './pomodoro_details.schema';

@Injectable()
export class PomodoroDetailsService {
  constructor(
    @InjectModel('PomodoroDetails')
    private pomodoroDetailsModel: Model<typeof PomodoroDetails>,
  ) {}

  // Create a new PomodoroDetails
  async createPomodoroDetails(data) {
    const pomodoroDetails = new this.pomodoroDetailsModel({
      task_id: data.task_id,
      cycle_number: data.cycle_number,
      start_time: data.start_time,
      end_time: data.end_time,
      session_status: data.session_status,
    });
    return pomodoroDetails.save();
  }

  // Update an existing PomodoroDetails
  async updatePomodoroDetails(detailsId, data) {
    return this.pomodoroDetailsModel.findByIdAndUpdate(
      detailsId,
      {
        $set: {
          task_id: data.task_id,
          cycle_number: data.cycle_number,
          start_time: data.start_time,
          end_time: data.end_time,
          session_status: data.session_status,
        },
      },
      { new: true }, // Return the updated document
    );
  }

  // Find all PomodoroDetails
  async findAllPomodoroDetails() {
    return this.pomodoroDetailsModel.find();
  }

  // Find a specific PomodoroDetails by ID
  async findPomodoroDetailsById(detailsId) {
    return this.pomodoroDetailsModel.findById(detailsId);
  }

  // Delete a PomodoroDetails by ID
  async deletePomodoroDetails(detailsId) {
    return this.pomodoroDetailsModel.findByIdAndDelete(detailsId);
  }
}
