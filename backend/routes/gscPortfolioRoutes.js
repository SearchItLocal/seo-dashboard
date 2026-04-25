/**
 * Backend Routes - Multi-Site Portfolio with Service Account Auth
 * Add this to your backend/routes/
 */

import express from 'express';
import { initializeGoogleAuth, fetchAllWebsitesData, getPortfolioSummary, fetchWebsiteData, ALL_WEBSITES } from '../services/gscServiceWithCredentials.js';

const router = express.Router();

// Cache for auth (lasts 1 hour)
let authCache = null;
let authCacheTime = null;

async function getAuth() {
  const now = Date.now();
  if (!authCache || !authCacheTime || now - authCacheTime > 55 * 60 * 1000) {
    console.log('Initializing new Google auth...');
    authCache = await initializeGoogleAuth();
    authCacheTime = now;
  }
  return authCache;
}

/**
 * GET /api/gsc-portfolio/list
 * Get list of all 120 websites
 */
router.get('/list', (req, res) => {
  try {
    res.json({
      success: true,
      count: ALL_WEBSITES.length,
      websites: ALL_WEBSITES,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch websites list',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/gsc-portfolio/sync-all
 * Sync ALL 120 websites from Google Search Console
 * This is the main endpoint - takes 5-10 minutes
 */
router.post('/sync-all', async (req, res) => {
  try {
    res.setHeader('Content-Type', 'application/json');
    res.write('{"status":"starting","message":"Initializing Google Authentication..."}\n');

    // Get authenticated client
    const auth = await getAuth();
    res.write('{"status":"authenticated","message":"Connected to Google Search Console API"}\n');

    // Fetch data for all websites
    res.write('{"status":"fetching","message":"Fetching data for all 120 websites..."}\n');
    const results = await fetchAllWebsitesData(auth, ALL_WEBSITES);

    // Get summary
    res.write('{"status":"processing","message":"Processing results..."}\n');
    const summary = getPortfolioSummary(results);

    // Send final results
    res.write(JSON.stringify({
      success: true,
      status: 'complete',
      data: summary,
      timestamp: new Date().toISOString()
    }) + '\n');

    res.end();
  } catch (error) {
    console.error('Error syncing portfolio:', error);
    res.status(500).json({
      error: 'Failed to sync portfolio',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/gsc-portfolio/single/:siteUrl
 * Fetch data for a single website
 */
router.get('/single/:siteUrl', async (req, res) => {
  try {
    const { siteUrl } = req.params;
    const decodedUrl = decodeURIComponent(siteUrl);

    const auth = await getAuth();
    const data = await fetchWebsiteData(auth, decodedUrl);

    res.json({
      success: data.success,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch website data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/gsc-portfolio/health
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'GSC Portfolio Service with Service Account',
    websites: ALL_WEBSITES.length,
    timestamp: new Date().toISOString()
  });
});

export default router;
