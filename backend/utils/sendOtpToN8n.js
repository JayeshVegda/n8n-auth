import axios from 'axios';

export const sendOtpToN8n = async (email, otp) => {
    
    if (!process.env.N8N_OTP_URL) {
        console.error('sendOtpToN8n: N8N_OTP_URL is not configured');
        return { success: false, error: 'N8N webhook URL not configured' };
    }

    try {
        const response = await axios.post(
            process.env.N8N_OTP_URL,
            {
                email: email.trim(),
                otp: otp.trim()
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000,
                validateStatus: (status) => status < 500
            }
        );
        
        return { success: true, status: response.status, data: response.data };
        
    } catch (error) {
      
        const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
        const statusCode = error.response?.status || 'N/A';
        
        console.error(`Failed to send otp to ${email}:`, {
            status: statusCode,
            message: errorMessage,
            url: process.env.N8N_OTP_URL
        });

        return { 
            success: false, 
            status: statusCode,
            error: errorMessage 
        };
    }
}