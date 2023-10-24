import mongoose from "mongoose";

mongoose.connect('mongodb://localhost/atecnologia');

const ScheduleConfirmation = new mongoose.Schema({
    service_code: {
        type: String,
        required: true
    },
    email_status: {
        type: String,
        required: true
    },
    client_name: {
        type: String,
        required: true
    },
    client_email: {
        type: String,
        required: true
    },
    service_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("ScheduleConfirmation", ScheduleConfirmation);