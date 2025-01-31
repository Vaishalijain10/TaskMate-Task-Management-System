// backend/services/helperFunctions.js


// Helper function to generate a 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit random number
}

// helper function to generate 10 digit new password
export function GenerateNewPassword() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); // 10-digit random number
}
