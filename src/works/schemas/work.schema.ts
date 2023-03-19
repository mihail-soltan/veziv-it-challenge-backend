import * as mongoose from 'mongoose';

export const WorkSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    visible: Boolean,
    customerWebsite: String,
})