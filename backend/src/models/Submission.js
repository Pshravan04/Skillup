const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
        },
        exam: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exam',
        },
        answers: [
            {
                questionId: mongoose.Schema.Types.ObjectId,
                answer: String, // Text answer or selected option
            },
        ],
        fileUrl: {
            type: String, // For assignment file uploads
        },
        grade: {
            type: Number,
        },
        feedback: {
            type: String,
        },
        submittedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
