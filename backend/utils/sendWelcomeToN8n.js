import axios from 'axios';

export const sendWelcomeToN8n = async (email, name) => {
    if (!process.env.N8N_WELCOME_URL) {
        console.error('sendWelcomeToN8n: N8N_WELCOME_URL is not configured');
        return { success: false, error: 'N8N webhook URL not configured' };
    }

    try {
        const response = await axios.post(
            process.env.N8N_WELCOME_URL,
            {
                email: email.trim(),
                name: name.trim()
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000, // 10 seconds timeout
                validateStatus: (status) => status < 500 // Don't throw for 4xx errors, only 5xx
            }
        );

        console.log(`Welcome email sent successfully to ${email}`);
        return { success: true, status: response.status, data: response.data };
        
    } catch (error) {
        // Log error but don't throw - email failure shouldn't block registration
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        const statusCode = error.response?.status || 'N/A';
        
        console.error(`Failed to send welcome email to ${email}:`, {
            status: statusCode,
            message: errorMessage,
            url: process.env.N8N_WELCOME_URL
        });

        return { 
            success: false, 
            status: statusCode,
            error: errorMessage 
        };
    }
}