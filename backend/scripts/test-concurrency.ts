import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log('--- Starting Concurrency Test ---');

        // 1. Create a Show
        console.log('Creating Show...');
        const showRes = await axios.post(`${API_URL}/admin/shows`, {
            name: `Test Show ${Date.now()}`,
            startTime: new Date().toISOString(),
            totalSeats: 50
        });
        const show = showRes.data;
        console.log(`Show created: ID ${show.id}`);

        // 2. Get Seats
        const seatsRes = await axios.get(`${API_URL}/shows/${show.id}/seats`);
        const seatId = seatsRes.data[0].id; // Pick first seat
        console.log(`Targeting Seat ID: ${seatId}`);

        // 3. Fire 20 Concurrent Requests
        const REQUESTS = 20;
        console.log(`Firing ${REQUESTS} concurrent booking requests for Seat ID ${seatId}...`);

        const promises = [];
        for (let i = 0; i < REQUESTS; i++) {
            const userId = `user_${i}`;
            // Booking seat #1
            promises.push(
                axios.post(`${API_URL}/shows/${show.id}/book`, {
                    userId,
                    seatIds: [seatId]
                }).then(res => ({ status: 'fulfilled', data: res.data, userId }))
                    .catch(err => ({ status: 'rejected', error: err.response?.data || err.message, userId }))
            );
        }

        const results = await Promise.all(promises);

        // 4. Analyze Results
        let successCount = 0;
        let failCount = 0;

        results.forEach((r: any) => {
            if (r.status === 'fulfilled') {
                successCount++;
                console.log(`[SUCCESS] User ${r.userId} booked the seat.`);
            } else {
                failCount++;
                // console.log(`[FAILED] User ${r.userId}:`, r.error);
            }
        });

        console.log('--- Results ---');
        console.log(`Total Requests: ${REQUESTS}`);
        console.log(`Success: ${successCount}`);
        console.log(`Failed: ${failCount}`);

        if (successCount === 1 && failCount === REQUESTS - 1) {
            console.log('✅ TEST PASSED: Concurrency handled correctly.');
        } else {
            console.log('❌ TEST FAILED: unexpected success count (should be 1).');
        }

    } catch (error: any) {
        console.error('Test failed with error:', error.message);
        if (error.response) console.error(error.response.data);
    }
}

runTest();
