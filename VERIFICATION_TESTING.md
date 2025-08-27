# Email Verification Flow Testing Guide

## Overview
This document explains how to test the email verification flow locally and troubleshoot common issues.

## How It Works
1. User submits form → Data stored in `PendingApplication` collection
2. Verification email sent with link to `/api/verify?token=...`
3. User clicks link → Data moved from `PendingApplication` to `Application` collection
4. User redirected to `/join?verified=1` → Thank you page shown

## Testing Locally

### 1. Start the Development Server
```bash
npm run dev
```

### 2. Submit a Test Application
- Go to `http://localhost:3000/join`
- Fill out the form with test data
- Submit the form
- You should see: "✅ Verification mail sent to your email. Please check your inbox and click the verification link."

### 3. Check the Console Logs
Look for these logs in your terminal:
```
Created pending application: [ID]
Sending verification email to: [email]
Verification URL: http://localhost:3000/api/verify?token=[token]
Verification email sent successfully
```

### 4. Check Your Email
- Look for the verification email (check spam folder)
- The email should contain a "Verify Email" button
- Click the button or copy the verification link

### 5. Verify the Flow
- Clicking the verification link should redirect you to `/join?verified=1`
- You should see the thank you page
- Check the console for: "Setting showThankYou to true"

## Database Verification

### Check Pending Applications
```bash
# In MongoDB shell or Compass
use your_database_name
db.pendingapplications.find()
```

### Check Final Applications
```bash
# After verification
db.applications.find()
```

## Troubleshooting

### Issue: Verification link not working
**Symptoms:**
- Clicking link shows error or doesn't redirect
- Console shows verification errors

**Solutions:**
1. Check if the verification URL is correct in the email
2. Ensure the token is being passed correctly
3. Check server logs for verification endpoint errors

### Issue: Thank you page not showing
**Symptoms:**
- Verification succeeds but thank you page doesn't appear
- URL shows `verified=1` but page doesn't change

**Solutions:**
1. Check browser console for "Setting showThankYou to true" log
2. Ensure the useEffect is running on component mount
3. Check if there are any JavaScript errors

### Issue: Data not moving to final collection
**Symptoms:**
- Pending application remains in database
- No final application created

**Solutions:**
1. Check verification endpoint logs
2. Ensure MongoDB connection is working
3. Verify the token matches a pending application

## Environment Variables
Make sure these are set in your `.env.local`:
```bash
MONGODB_URI=your_mongodb_connection_string
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Common Error Messages

### "No verification token provided"
- The verification link is missing the token parameter
- Check email template and verification URL generation

### "Invalid or expired verification token"
- Token doesn't match any pending application
- Token may have expired or been used already

### "Registration number already exists"
- Another application with same registration number was verified
- Check for duplicate submissions

### "Server error occurred during verification"
- Database connection issue or other server error
- Check server logs for detailed error information

## Testing with Different Email Providers
- **Gmail**: Usually works well, check spam folder
- **Yahoo**: May have delivery issues, check spam
- **College emails (.ac.in)**: May be blocked by institutional filters
- **Outlook**: Check junk folder

## Next Steps for Production
1. Replace simulated email validation with real service
2. Add rate limiting to prevent abuse
3. Add token expiration (currently tokens don't expire)
4. Add email templates for different scenarios
5. Add monitoring and analytics for verification success rates

