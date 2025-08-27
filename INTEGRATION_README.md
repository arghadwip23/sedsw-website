# Frontend-Backend Integration Documentation

## Overview
This document describes the integration between the frontend join form (`src/app/join/page.tsx`) and the backend API (`src/app/api/applications/route.ts`), including the new Gmail validation system.

## Integration Features

### Frontend (`join/page.tsx`)
- **Form Validation**: Client-side validation for all required fields
- **Gmail Validation**: Real-time validation of Gmail addresses
- **Department Validation**: Ensures primary and secondary departments are different
- **Email/Phone Validation**: Basic format validation
- **Loading States**: Visual feedback during form submission and email validation
- **Error Handling**: Displays API errors and validation messages
- **Success Feedback**: Shows success message before redirecting to thank you page

### Backend (`api/applications/route.ts`)
- **Origin Verification**: Security check for request origins
- **Input Validation**: Server-side validation of all required fields
- **Duplicate Check**: Prevents duplicate registration numbers
- **Database Storage**: Saves applications to MongoDB
- **Email Verification**: Sends verification emails via Resend
- **Success Registration Email**: Sends welcome email after successful submission
- **Comprehensive Logging**: Debug logging for monitoring

### Gmail Validation System (`api/validate-email/route.ts`)
- **Real-time Validation**: Validates email addresses (any domain) as users type
- **Format Checking**: Ensures proper email format
- **Existence Verification**: Simulated plausibility check (replaceable with real service)
- **Debounced Requests**: Prevents excessive API calls during typing

## API Endpoints

### **POST** `/api/applications`
Main application submission endpoint.

### **POST** `/api/validate-email`
Gmail validation endpoint.

#### Request Body
```typescript
{
  email: string;
}
```

#### Response
```typescript
{
  success: boolean;
  message: string;
  email?: string;
  details?: string;
}
```

## Email System

### Verification Email
- Sent to verify user's email address
- Contains verification link with token
- Required for account activation

### Success Registration Email
- Sent immediately after successful application submission
- Welcomes user to SEDS Antariksh
- Includes department information and next steps
- Professional HTML template with styling

## Required Environment Variables

```bash
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Resend API for emails
RESEND_API_KEY=your_resend_api_key

# Base URL for verification links
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Data Flow

1. User fills out the join form
2. **Gmail validation occurs in real-time** as user types
3. Frontend validates all input fields
4. Form data is sent to `/api/applications`
5. Backend validates data and checks for duplicates
6. Application is saved to MongoDB
7. **Two emails are sent**:
   - Verification email with token
   - Success registration welcome email
8. Success response is returned to frontend
9. User sees success message and is redirected to thank you page

## Gmail Validation Features

- **Real-time Feedback**: Users see validation status as they type
- **Visual Indicators**: 
  - Yellow border + spinner during validation
  - Green border + checkmark for valid emails
  - Red border + error icon for invalid emails
- **Debounced Requests**: Waits 500ms after user stops typing
- **Gmail Only**: Restricts to @gmail.com addresses
- **Professional Messages**: Clear error and success messages

## Error Handling

- **Validation Errors**: Displayed inline with the form
- **Gmail Validation Errors**: Real-time feedback with specific messages
- **API Errors**: Shown as error messages
- **Network Errors**: Generic error message for connection issues
- **Duplicate Registration**: Clear message about existing registration

## Security Features

- Origin verification to prevent unauthorized requests
- Input sanitization and validation
- Rate limiting (can be added if needed)
- Secure token generation for email verification
- Gmail format and existence validation

## Testing the Integration

1. Start the development server: `npm run dev`
2. Navigate to `/join` page
3. **Test Gmail validation**:
   - Enter invalid email formats
   - Enter valid Gmail addresses
   - Watch real-time validation feedback
4. Fill out the form with test data
5. Submit and check the console for API logs
6. Verify the application is saved to MongoDB
7. Check if both emails are sent (verification + success)

## Troubleshooting

- Check browser console for frontend errors
- Check server console for backend logs
- Verify environment variables are set correctly
- Ensure MongoDB is running and accessible
- Check Resend API key if email verification fails
- **Gmail validation issues**: Check network requests to `/api/validate-email`

## Production Considerations

### Email Validation Services
For production, consider integrating with professional email validation services:
- **ZeroBounce API**: Comprehensive email validation
- **Abstract API**: Email verification and validation
- **EmailValidator.net**: Real-time email validation
- **Mailgun**: Email validation and delivery

### Gmail Validation
Replace the simulated validation in `EmailValidator.simulateGmailValidation()` with actual API calls to validation services for accurate results.
