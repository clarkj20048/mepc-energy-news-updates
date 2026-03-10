# TODO: Fix Unauthorized Error on Admin Dashboard

## Problem
Users cannot add or delete news on the admin dashboard - getting "Unauthorized" error despite being logged in.

## Root Cause
- CORS configuration in `backend/server.js` had a bug where it wasn't properly handling all origin cases
- Session cookies may not have been properly sent due to CORS/cookie configuration issues
- Missing `trust proxy` configuration for production deployments

## Solution Applied
1. Fixed CORS middleware to always set proper `Access-Control-Allow-Origin` header
2. Added `trust proxy` configuration for production deployments
3. Improved session cookie configuration with proper path setting

## Files Edited
- [x] `backend/server.js` - Fixed CORS and session cookie configuration

## Status
✅ Fix applied - redeploy the backend to test the changes

