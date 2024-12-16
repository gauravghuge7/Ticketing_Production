import mongoose from 'mongoose';

// Define the schema for ticket counter
const ticketCounterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Fixed ID, e.g., "ticketCounter"
    counter: { type: Number, required: true, default: 1 },
});

// Create the model
const TicketCounter = mongoose.model('TicketCounter', ticketCounterSchema);

// Function to generate ticket ID
const generateTicketId = async () => {
    try {
        // Find the current counter value and increment it atomically
        const updatedCounter = await TicketCounter.findByIdAndUpdate(
            { _id: 'ticketCounter' },
            { $inc: { counter: 1 } },
            { new: true, upsert: true } // Create document if it doesn't exist
        );

        // Generate the ticket ID with the updated counter
        const ticketId = `GBIS${String(updatedCounter.counter).padStart(7, '0')}`;
        console.log("Ticket ID generated => ", ticketId);

        return ticketId;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate ticket ID');
    }
};

export { generateTicketId };
