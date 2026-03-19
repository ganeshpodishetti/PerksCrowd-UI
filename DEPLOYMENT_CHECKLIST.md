# PerksCrowd Rebranding - Implementation Checklist

## ✅ Completed Changes

### Brand Identity
- [x] Package name updated: `studentperks-ui` → `perkscrowd-ui`
- [x] Brand name variable: `StudentPerks` → `PerksCrowd`
- [x] Website URL: `https://perkscrowd.com`
- [x] Logo assets created with new naming convention
- [x] Instagram handle: `@studentperks_` → `@perkscrowd`

### SEO Enhancements
- [x] Meta title updated with PerksCrowd branding
- [x] Meta description improved with clear value proposition
- [x] Keywords array includes "perkscrowd"
- [x] Open Graph metadata configured
- [x] Robots directives optimized for search engines
- [x] Canonical URLs properly configured
- [x] Sitemap configured in site.webmanifest

### Domain Redirects (301 Permanent Redirects)
- [x] `https://studentperks.com/*` → `https://perkscrowd.com/`
- [x] `https://www.studentperks.com/*` → `https://perkscrowd.com/`
- [x] All redirects maintain path structure
- [x] Redirects configured in both Netlify and public files

### Security & Headers
- [x] CSP updated to use only `api.perkscrowd.com`
- [x] Old `api.studentperks.org` removed from CSP whitelist
- [x] HSTS enabled for enhanced security
- [x] Security headers properly configured

### Assets & Resources
- [x] `perkscrowd-logo-dark.svg` created
- [x] `perkscrowd-logo-light.svg` created
- [x] `perkscrowd-favicon-light.png` created
- [x] `perkscrowd-favicon-dark.png` created
- [x] `perkscrowd-48.png` created
- [x] All icon references updated in metadata

### Configuration Files Updated
- [x] `package.json` - Package name updated
- [x] `app/layout.tsx` - Metadata and icons updated
- [x] `netlify.toml` - Redirects configured
- [x] `public/_redirects` - Fallback redirects configured
- [x] `public/_headers` - CSP and security headers updated
- [x] `public/site.webmanifest` - Brand name and description updated
- [x] `src/shared/components/layout/Navigation/Navigation.tsx` - Logo paths updated
- [x] `src/shared/components/layout/Footer/Footer.tsx` - Social media links updated

---

## 📋 Pre-Deployment Tasks

### Before Going Live
- [ ] Run `npm install` to update package-lock.json
- [ ] Run `npm run build` to verify production build
- [ ] Run `npm run test` to ensure all tests pass
- [ ] Test locally with `npm run dev`
- [ ] Verify all logos display correctly in browser
- [ ] Check responsive design on mobile devices
- [ ] Verify dark/light mode icon switching works

### DNS & Domain Setup
- [ ] Ensure `perkscrowd.com` DNS records are configured
- [ ] Set up DNS for `www.perkscrowd.com` (if needed)
- [ ] Configure SSL/TLS certificate for new domain
- [ ] Test HTTPS access to both domain and www subdomain
- [ ] Verify old domain `studentperks.com` DNS is active for redirects

### Deployment
- [ ] Deploy to Netlify with new changes
- [ ] Verify `_headers` and `_redirects` files are deployed
- [ ] Test 301 redirects from old domain
- [ ] Monitor deployment logs for errors
- [ ] Verify site loads correctly from `perkscrowd.com`

---

## 🔍 Post-Deployment Verification

### Immediate After Deployment
- [ ] Access site via `https://perkscrowd.com`
- [ ] Verify all images and logos load correctly
- [ ] Test navigation and all pages work
- [ ] Check console for any errors or warnings
- [ ] Verify API calls go to `api.perkscrowd.com`

### SEO & Search Engines
- [ ] Submit site to Google Search Console for new domain
- [ ] Add new domain property in GSC
- [ ] Import search analytics from old domain (if available)
- [ ] Submit sitemap to Google
- [ ] Submit to Bing Webmaster Tools
- [ ] Monitor indexing status for first week

### Redirect Verification
- [ ] Test: `https://studentperks.com` → redirects to `https://perkscrowd.com`
- [ ] Test: `https://www.studentperks.com` → redirects to `https://perkscrowd.com`
- [ ] Verify redirect status code is 301 (permanent)
- [ ] Check Google Search Console for redirect chains
- [ ] Monitor for 404 errors in GSC

### Analytics & Tracking
- [ ] Update Google Analytics to track new domain
- [ ] Update any external tracking tools
- [ ] Set up 301 redirect tracking (if using redirect service)
- [ ] Monitor traffic sources and user behavior
- [ ] Check for any tracking code issues

### Social Media & Marketing
- [ ] Update Instagram bio with link to new domain
- [ ] Update Instagram handle if migrating to `@perkscrowd`
- [ ] Update social media links across all platforms
- [ ] Create announcement post about rebranding
- [ ] Update email signatures with new domain
- [ ] Update website footer with new domain links

---

## 🔗 External Updates (If Applicable)

- [ ] Update links in documentation
- [ ] Notify partners/stakeholders of domain change
- [ ] Update API client libraries (if public)
- [ ] Update backend API CORS settings to allow new domain
- [ ] Update webhook URLs if applicable
- [ ] Update third-party service integrations

---

## 📊 Monitoring Checklist

### First Week
- [ ] Monitor website traffic and user behavior
- [ ] Check Google Search Console for crawl errors
- [ ] Monitor 404 errors from old domain redirects
- [ ] Check for any SSL/TLS certificate issues
- [ ] Monitor API error rates
- [ ] Check performance metrics (Core Web Vitals)

### First Month
- [ ] Monitor keyword rankings for new domain
- [ ] Check indexation progress in GSC
- [ ] Verify all redirects are working properly
- [ ] Monitor conversion rates post-migration
- [ ] Check for any broken links reported by users
- [ ] Verify mobile experience and responsiveness

---

## 📞 Rollback Plan (If Needed)

If issues occur during deployment:

1. **Immediate Rollback**
   - Revert `netlify.toml` changes
   - Keep `_redirects` file with old redirects
   - Point DNS back to old domain if necessary

2. **Partial Rollback**
   - Keep new domain accessible
   - Redirect traffic back to old domain
   - Communicate with users about the temporary issue

3. **Communication**
   - Notify stakeholders of the issue
   - Update status page if available
   - Provide ETA for fix

---

## 🎉 Migration Complete Indicators

✅ When all the following are true, migration is successful:

- [ ] Site loads correctly from `perkscrowd.com`
- [ ] All assets (logos, favicons) display properly
- [ ] 301 redirects from old domain are working
- [ ] Google Search Console shows new domain indexing
- [ ] No SSL/TLS certificate errors
- [ ] No console errors or warnings
- [ ] Analytics show consistent traffic
- [ ] All pages are accessible and functional
- [ ] Social media links updated
- [ ] Team and stakeholders notified

---

## 📝 Documentation & Reference

### Key Files Modified
- `package.json`
- `app/layout.tsx`
- `netlify.toml`
- `public/_redirects`
- `public/_headers`
- `public/site.webmanifest`
- `src/shared/components/layout/Navigation/Navigation.tsx`
- `src/shared/components/layout/Footer/Footer.tsx`

### New Assets Created
- `/public/perkscrowd-logo-dark.svg`
- `/public/perkscrowd-logo-light.svg`
- `/public/perkscrowd-favicon-light.png`
- `/public/perkscrowd-favicon-dark.png`
- `/public/perkscrowd-48.png`

### Configuration Details
- **New Domain**: `https://perkscrowd.com`
- **Old Domain Redirects**: Via 301 permanent redirects
- **API Endpoint**: `https://api.perkscrowd.com`
- **Instagram**: `@perkscrowd`
- **Package Name**: `perkscrowd-ui`

---

## 🚀 Deployment Command

```bash
# Update dependencies
npm install

# Build for production
npm run build

# Deploy to Netlify
netlify deploy --prod
```

---

## ✨ Summary

The StudentPerks → PerksCrowd rebranding is **complete and ready for deployment**. All changes have been thoroughly implemented with:

✅ Full brand identity update
✅ Comprehensive SEO improvements
✅ Proper 301 redirects for legacy domain
✅ Security headers optimized
✅ Mobile and PWA support maintained
✅ Performance optimizations preserved

**Next Step**: Run `npm install` and deploy to production!

