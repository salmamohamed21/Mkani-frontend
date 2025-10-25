# TODO: Fix CORS and API Endpoint Issues for Vercel Frontend and Railway Backend

## Tasks
- [x] Update axiosClient.jsx baseURL to production Railway URL
- [x] Ensure all axios instances use withCredentials: true
- [x] Verify CORS settings in Django settings for Vercel domain
- [x] Check cookie settings for production (samesite, secure)
- [ ] Test API calls after changes

## Followup Steps
- Build and deploy frontend to Vercel
- Test authentication flow (login, profile fetch)
- Check browser console for CORS errors
- Verify cookies are being sent/received correctly
