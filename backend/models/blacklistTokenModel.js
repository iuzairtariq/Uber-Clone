import mongoose from 'mongoose';

const { Schema } = mongoose;

const blacklistTokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds
    }
});

export default mongoose.model('BlacklistToken', blacklistTokenSchema);