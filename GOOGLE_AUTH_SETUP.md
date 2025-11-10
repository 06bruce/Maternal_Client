# Google Authentication Setup Guide

## Frontend Setup (Completed ✅)

The following changes have been implemented:

### 1. Fixed Import Issues
- ✅ Fixed typo: `"jtw-decode"` → `"jwt-decode"`
- ✅ Installed `jwt-decode` package

### 2. Environment Configuration
- ✅ Fixed environment variable: `process.env.CLIENT_ID` → `process.env.REACT_APP_GOOGLE_CLIENT_ID`
- ✅ Created `.env.example` file with required variables

### 3. API Integration
- ✅ Added `googleAuth` endpoint to `/src/utils/api.js`
- ✅ Endpoint: `POST /api/auth/google`

### 4. LoginPage Implementation
- ✅ Implemented `handleGoogleSuccess` handler
- ✅ Implemented `handleGoogleError` handler
- ✅ Integrated GoogleLogin component with proper props
- ✅ Added bilingual error messages (English/Kinyarwanda)

## Required Environment Variables

Create a `.env` file in the root directory:

```bash
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_URL=https://maternal-server.onrender.com
```

## Getting Your Google Client ID

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click on the project dropdown
   - Create a new project or select an existing one

3. **Enable Google+ API**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"
   - Add name (e.g., "Maternal Hub Frontend")

5. **Configure Authorized Origins**
   - Add your development URL: `http://localhost:3000`
   - Add your production URL: `https://maternalhub.vercel.app`

6. **Configure Authorized Redirect URIs**
   - Development: `http://localhost:3000`
   - Production: `https://maternalhub.vercel.app`

7. **Copy Client ID**
   - Copy the generated Client ID
   - Paste it into your `.env` file

## Backend Requirements

Your backend must implement the `/api/auth/google` endpoint to:

1. **Receive the Google credential token**
   ```javascript
   // Expected request body
   {
     "credential": "google_jwt_token_here"
   }
   ```

2. **Verify the token with Google**
   - Use Google's OAuth2 library to verify the token
   - Extract user information (email, name, picture, etc.)

3. **Create or update user**
   - Check if user exists by email
   - Create new user if doesn't exist
   - Update existing user if needed

4. **Return authentication response**
   ```javascript
   // Expected response
   {
     "token": "your_jwt_token",
     "user": {
       "id": "user_id",
       "email": "user@example.com",
       "name": "User Name",
       "isAuthenticated": true,
       // ... other user fields
     }
   }
   ```

## Backend Implementation Example (Node.js/Express)

```javascript
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        name,
        googleId,
        profilePicture: picture,
        authProvider: 'google'
      });
    } else {
      // Update user info if needed
      user.googleId = googleId;
      user.profilePicture = picture;
      await user.save();
    }
    
    // Generate JWT token
    const token = generateJWT(user);
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
        isAuthenticated: true
      }
    });
    
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Invalid Google credentials' });
  }
});
```

## Testing

1. **Start your development server**
   ```bash
   npm start
   ```

2. **Navigate to the login page**
   - URL: `http://localhost:3000/login`

3. **Click the Google Sign In button**
   - Should see Google's OAuth popup
   - Select your Google account
   - Grant permissions

4. **Verify authentication**
   - Should redirect to home page
   - User should be logged in
   - Token should be stored in localStorage

## Troubleshooting

### "Invalid Client ID" Error
- Check that `REACT_APP_GOOGLE_CLIENT_ID` is correctly set in `.env`
- Restart development server after adding environment variables
- Verify the Client ID matches what's in Google Cloud Console

### "Redirect URI mismatch" Error
- Ensure authorized redirect URIs include your current URL
- Check for trailing slashes in URLs
- Make sure protocol (http/https) matches

### "Invalid credentials" Error from Backend
- Verify backend has the same Google Client ID
- Check backend token verification logic
- Ensure backend dependencies are installed

### Button not appearing
- Check browser console for errors
- Verify `@react-oauth/google` is installed
- Ensure `GoogleOAuthProvider` wraps your app in `App.jsx`

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Don't hardcode credentials
3. **Validate tokens on backend** - Always verify Google tokens server-side
4. **Use HTTPS in production** - Required for OAuth2
5. **Keep dependencies updated** - Regularly update `@react-oauth/google`

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Google Cloud Console](https://console.cloud.google.com/)
