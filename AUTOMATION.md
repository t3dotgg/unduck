# Bang List Automation

This project includes automated updates for the bang list from DuckDuckGo's official API.

## How it works

### 1. GitHub Actions Workflow
- **File**: `.github/workflows/update-bangs.yml`
- **Schedule**: Runs automatically on the 1st of every month at 2 AM UTC
- **Manual trigger**: Can be triggered manually via GitHub Actions UI
- **Auto-trigger**: Runs when the workflow file itself is updated

### 2. Update Script
- **File**: `scripts/update-bangs.js`
- **Function**: Fetches bang data from `https://duckduckgo.com/bang.js` and converts it to our format
- **Output**: Updates `src/bang.ts` with the latest bang definitions

### 3. Data Format Conversion

**DuckDuckGo API format:**
```json
{
  "c": "Tech",
  "d": "www.01net.com", 
  "r": 0,
  "s": "01net",
  "sc": "Downloads (apps)",
  "t": "01net",
  "u": "http://www.01net.com/recherche/recherche.php?searchstring={{{s}}}&chaine=home"
}
```

**Our format:**
```typescript
{
  t: "01net",                    // trigger
  s: "01net",                    // name/description  
  u: "http://www.01net.com/...", // url template
  d: "www.01net.com"             // domain
}
```

## Manual Usage

To manually update the bang list:

```bash
npm run update-bangs
```

## Workflow Features

- ✅ **Automatic monthly updates** - Keeps bang list current
- ✅ **Manual triggering** - Update on demand via GitHub UI
- ✅ **Change detection** - Only commits if there are actual changes
- ✅ **Auto-deployment** - Builds and deploys when changes are detected
- ✅ **Skip CI on commits** - Prevents infinite loops with `[skip ci]` tag
- ✅ **Error handling** - Fails gracefully with proper error messages

## First Run

The workflow is configured to run immediately when:
1. The workflow file is first added/updated
2. Pushed to the main/master branch

After that, it will run monthly on the 1st of each month.

## Monitoring

Check the GitHub Actions tab in your repository to monitor:
- Workflow execution status
- Update logs
- Any errors or failures
- Number of bangs updated

## File Structure

```
.github/
  workflows/
    update-bangs.yml     # GitHub Actions workflow
scripts/
  update-bangs.js        # Update script
src/
  bang.ts               # Auto-generated bang definitions (DO NOT EDIT MANUALLY)
```

## Important Notes

- **DO NOT** manually edit `src/bang.ts` - it will be overwritten
- The script handles special characters and escaping automatically
- Updates are atomic - either all bangs update or none do
- The workflow uses Node.js 18 for compatibility 