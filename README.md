# Instagram Integration Next.js Application

This application integrates with the Instagram API to display user profiles, media feeds, and allows interaction with comments.

## Features

- Instagram OAuth Authentication
- Profile details display
- Media feed with support for images, videos, and carousel albums
- Comments and replies functionality
- Responsive design

## Prerequisites

To run this application, you'll need:

1. Node.js (v14 or higher)
2. A Facebook Developer account
3. An Instagram Business or Creator account

## Setting Up Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app and select "Others" → "Business"
3. Add the Instagram Basic Display product
4. Configure the following settings:
   - Redirect URLs: `http://localhost:3000/api/auth/callback/instagram` (for development) and your production URL
   - Deauthorize Callback URL: Your app's base URL
   - Data Deletion Request URL: Your app's data deletion endpoint
5. Note your App ID and App Secret

## Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```
INSTAGRAM_CLIENT_ID=your_app_id
INSTAGRAM_CLIENT_SECRET=your_app_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
INSTAGRAM_API_URL=https://graph.instagram.com
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Deployment

You can deploy this application to Vercel, Netlify, or any other hosting service that supports Next.js.

### Deploying to Vercel

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Configure environment variables in the Vercel dashboard
4. Deploy!

## Testing

For the assessment, add MetaAPIExpert as an Admin in your Facebook App Roles to allow testing.

## API Permissions

This application requires the following Instagram permissions:
- `user_profile` - To access basic profile information
- `user_media` - To access media data

Note that for commenting functionality, additional permissions and app review may be required.

## Project Structure

- `/pages` - Next.js pages and API routes
- `/components` - React components for UI
- `/styles` - CSS and styling files
- `/public` - Static assets

## Troubleshooting

- If you encounter Instagram API rate limits, try implementing caching strategies
- For authentication issues, verify your App ID and Secret, and ensure redirect URLs are correctly configured
- Check Facebook Developer Console for detailed error messages

## Assessment Checklist

- [x] Create a Facebook App (5 points)
- [x] Enable Instagram Login (5 points)
- [ ] Design (20 points)
- [ ] Auth (20 points)
- [ ] User Profile (10 points)
- [ ] User Feed (20 points)
- [ ] Comment Reply Feature (20 points)