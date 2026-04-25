/**
 * Google Search Console Service - Production Ready
 * Pulls real data from all 120 websites via authenticated service account
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Service account credentials (paste your JSON file content here)
const SERVICE_ACCOUNT_KEY = {
  "type": "service_account",
  "project_id": "unified-firefly-146822",
  "private_key_id": "7fda5c944a8922051938201a5c3a7a9abb2967c7",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDAyFv6YEsWrW8+\nL9WHtcKGI5QgDL6uutCX6nddaTbkkCV0823ejK0trxa1qVunnwG6uP8mJjewEy0A\nP5rr/XFfGFkPCOrSbrAgCmTVPgNe1RnOoWNLqVLY7akty1J/fQYMQLOt4RWtAky8\n2kO3HBG1uyQqIrPJFv62WI0iN5eZuwbM4a4m9o0/MSB6WbHyZeH/sGkcb1X9vB9g\njjTAjXXrKeMqkX3HBp4StI40aar6MxYd6ui/usXt/xXcqlVQ7fBDLZKOhCzNOohq\nMCa1c337Hfaku83qJxngoc7xjJ7R7PVWTwrLvbP2+Y3BjYom6IX8hPhdnX54JlJG\noIlkmaVLAgMBAAECggEAQvLx2kwpl4kIinCjN5t8IAhoDw9OAzE2cqOG64Y3/X0/\nvNMzEygIlkZpXRIhFd+nApjvZui7yyaFqMHuA8mC3zL97rY6knTFLoNdjB6angrk\niPlMGgEGF/bFG3WyQzsAaC3qGFcEJ46WZrln7cXOMq34e7eMdyfIsjujW8Axoj2S\nBpWDgpdwMBzlkuNNApuDdDTSDbLM9uV2EQtTWzQybF6MH3YwquRt2B5wztY+9LeD\nZ1MmHoI6BExY7vgC4UDz0tm4xjB3VXMeTirwvU3l9DP13UfJLngb2O8magjSTh5T\nMGCaj5LBrLHdvl2SpDZ4CBTlJyyJbwssUwvK911oIQKBgQDutPR7HO/vbtUY6EL/\nWR1WnXcoUbGbog1qlEOG/fkdslSWHW+P94rwELi0hqj8h69sOGjQJTWQMN+NO9LQ\nemuvxk73KV6J1b3cKUBMfo2T9PLO+2FPBVV+jnKfUJapbZyl45aLOIuo+yFJ1yaZ\nroNVLfqVQxPokbHge2l/BqaOYQKBgQDOv7JH8UZsauJeWg7TPdvkqxGM2G6AH/Bz\nll6petgsr4jCEf5pahSzfwrCqu82GWboGw3PC5IT0HobJE9IwlTo/z1UwLKkUrWQ\nCOKXjNTneauOaOaF6OSXAcWkRNp8rD5X//+gRtWjK6G1EvQRjC9az+QjZ7mdDwZ/\nDYPruEubKwKBgE0/Eb6lZp+85gjhYIzxcaUN3/mUNj1++4h54kBU/8C0bNsHO4sD\nOFrnjl4dFaJi5knHF2QEJok6x50UtuvwMdj3+6XQJV/FY2NTlhMrAPXYVprUjnDb\n8Qa7YixcD+VUK1UjiRwUeF1+pw8WKM+iwa1W67hRtKeWPlG+ni0VIeEBAoGBALhv\nijtjoc9WClrhPBh2NpPnh+B9sxXZaEe0/P1z+STj8rwuESc42v7FdnPyyTMZthOZ\nDtiFGetTL5rG6XOe6OBx0eSpgrPUlOPJCVro54UXpVOFgSA0grezfPzt73sIrRUT\n6pawmiTV54wBPHnq9NOuYXa0MYFKxiDRjb3aypfBAoGBAMw/HKdMuCIZeFtcNILY\n9IPnMWLL7zKGQ4F9VUJmaAhJ3dGZTZkOmRlYkobYwE9QV15Xo3M2padZ8Z/huzbV\n7dRrj2dQ+x7zs30bVvplxQl/axh/2OV/J46iPvdccw10c6Pr+zqtPUh3blsia/ID\nHCnZT/LehSKCsEBmsJNG639s\n-----END PRIVATE KEY-----\n",
  "client_email": "search-console-api@unified-firefly-146822.iam.gserviceaccount.com",
  "client_id": "114335150980083144441",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/search-console-api%40unified-firefly-146822.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// All 120 websites from your Excel sheet
export const ALL_WEBSITES = [
  { url: 'https://joyfulwarriorprincess.com.au/', specialist: 'Rand Halasa', fee: 500 },
  { url: 'https://www.garyhamerinteriors.com.au/', specialist: 'Eugene Lumanlan', fee: 550 },
  { url: 'https://dkcdents.com.au', specialist: 'Eugene Lumanlan', fee: 550 },
  { url: 'http://astonandcopaintingdecorating.com.au', specialist: 'Eugene Lumanlan', fee: 550 },
  { url: 'http://petesupholsteryandtrimming.com.au/', specialist: 'Eugene Lumanlan', fee: 550 },
  { url: 'http://hivesdemolition.com.au', specialist: 'Rand Halasa', fee: 581.16 },
  { url: 'http://pearlscreations.com.au/', specialist: 'Rand Halasa', fee: 600 },
  { url: 'http://mrroadsidemobilemechanic.com.au/', specialist: 'Rand Halasa', fee: 639.28 },
  { url: 'https://www.cessnocktankworks.com.au/', specialist: 'Rand Halasa', fee: 650 },
  { url: 'https://thesoundlab.com.au/', specialist: 'Eugene Lumanlan', fee: 660 },
  { url: 'https://spidersecurity.com.au', specialist: 'Rand Halasa', fee: 660 },
  { url: 'https://www.abcdbuilder.com.au/', specialist: 'Eugene Lumanlan', fee: 732.6 },
  { url: 'http://blackwoodosteopathy.com.au', specialist: 'Diego Varoli', fee: 800 },
  { url: 'http://livingconsciously.com.au', specialist: 'Eugene Lumanlan', fee: 842.6 },
  { url: 'http://mountainhollowragdolls.com.au', specialist: 'Diana Rodriguez', fee: 997.7 },
  { url: 'https://chihouseclinic.com/', specialist: 'Georgia Rose', fee: 998 },
  { url: 'https://glengilbertsonfloorsanding.com.au/', specialist: 'Diana Rodriguez', fee: 1000 },
  { url: 'http://fiestaloca.com.au', specialist: 'Diego Varoli', fee: 1000 },
  { url: 'http://maryvalleypetcremation.com.au', specialist: 'Eugene Lumanlan', fee: 1000 },
  // Add more sites from your 120 website list here...
];

/**
 * Initialize Google Authentication with Service Account
 */
export async function initializeGoogleAuth() {
  const auth = new google.auth.JWT({
    email: SERVICE_ACCOUNT_KEY.client_email,
    key: SERVICE_ACCOUNT_KEY.private_key,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly']
  });

  await auth.authorize();
  return auth;
}

/**
 * Fetch GSC data for a single website
 */
export async function fetchWebsiteData(auth, siteUrl, startDate = null, endDate = null) {
  const searchconsole = google.webmasters('v3');

  if (!startDate) {
    startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);
  }
  if (!endDate) {
    endDate = new Date();
  }

  const startDateStr = startDate instanceof Date ? startDate.toISOString().split('T')[0] : startDate;
  const endDateStr = endDate instanceof Date ? endDate.toISOString().split('T')[0] : endDate;

  try {
    const response = await searchconsole.searchanalytics.query({
      siteUrl: siteUrl,
      auth: auth,
      requestBody: {
        startDate: startDateStr,
        endDate: endDateStr,
        dimensions: ['page'],
        metrics: ['clicks', 'impressions', 'ctr', 'position'],
        orderBy: [{ name: 'clicks', isDescending: true }],
        rowLimit: 10
      }
    });

    const rows = response.data.rows || [];
    
    // Calculate QTV
    const totalClicks = rows.reduce((sum, row) => sum + (row.clicks || 0), 0);
    const conversionRate = 0.02; // 2%
    const leadValue = 500;
    const qtv = Math.round(totalClicks * conversionRate * leadValue);
    const leads = Math.round(totalClicks * conversionRate);

    return {
      siteUrl,
      success: true,
      clicks: totalClicks,
      qtv,
      leads,
      topPages: rows.slice(0, 5),
      allPages: rows
    };
  } catch (error) {
    console.error(`Error fetching ${siteUrl}:`, error.message);
    return {
      siteUrl,
      success: false,
      error: error.message,
      qtv: 0,
      leads: 0,
      clicks: 0
    };
  }
}

/**
 * Fetch data for ALL websites
 */
export async function fetchAllWebsitesData(auth, websites = ALL_WEBSITES) {
  console.log(`Fetching data for ${websites.length} websites...\n`);

  const results = [];
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < websites.length; i++) {
    const website = websites[i];
    console.log(`[${i + 1}/${websites.length}] Fetching: ${website.url}`);

    const data = await fetchWebsiteData(auth, website.url);
    
    if (data.success) {
      successful++;
      console.log(`  ✅ QTV: $${data.qtv.toLocaleString()} | Leads: ${data.leads}`);
    } else {
      failed++;
      console.log(`  ❌ Error: ${data.error}`);
    }

    results.push({
      ...website,
      ...data
    });

    // Rate limit: 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n✅ Complete: ${successful} successful, ${failed} failed`);

  return {
    total: websites.length,
    successful,
    failed,
    websites: results
  };
}

/**
 * Get portfolio summary
 */
export function getPortfolioSummary(results) {
  const successful = results.websites.filter(w => w.success);
  
  const totalQTV = successful.reduce((sum, w) => sum + (w.qtv || 0), 0);
  const totalLeads = successful.reduce((sum, w) => sum + (w.leads || 0), 0);
  const totalClicks = successful.reduce((sum, w) => sum + (w.clicks || 0), 0);

  // Group by specialist
  const bySpecialist = {};
  successful.forEach(site => {
    if (!bySpecialist[site.specialist]) {
      bySpecialist[site.specialist] = { sites: 0, qtv: 0, leads: 0 };
    }
    bySpecialist[site.specialist].sites += 1;
    bySpecialist[site.specialist].qtv += site.qtv || 0;
    bySpecialist[site.specialist].leads += site.leads || 0;
  });

  // Top performers
  const topPerformers = successful
    .sort((a, b) => (b.qtv || 0) - (a.qtv || 0))
    .slice(0, 10);

  // Sites needing attention
  const needsAttention = successful
    .filter(s => (s.qtv || 0) < 5000)
    .sort((a, b) => (a.qtv || 0) - (b.qtv || 0))
    .slice(0, 10);

  return {
    summary: {
      totalWebsites: results.total,
      successfulWebsites: successful.length,
      totalQTV,
      totalLeads,
      totalClicks,
      avgQTVPerSite: Math.round(totalQTV / successful.length)
    },
    bySpecialist,
    topPerformers,
    needsAttention,
    allResults: results.websites
  };
}
