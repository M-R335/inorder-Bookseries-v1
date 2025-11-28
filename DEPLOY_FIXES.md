# Deployment Fixes for AWS Elastic Beanstalk

## Changes Applied

1.  **Dependency Configuration (`package.json`)**:
    -   Moved build-time dependencies from `devDependencies` to `dependencies` to ensure they are available during the Elastic Beanstalk deployment process (`npm --omit=dev install`).
    -   **Moved**: `tailwindcss`, `postcss`, `autoprefixer`, `typescript`, `@types/react`, `@types/react-dom`, `@types/node`, `@types/pg`.
    -   **Version Fixes**:
        -   Corrected `typescript` version from `^5.9.3` (invalid) to `^5.7.2` (stable).
        -   Corrected `@types/react` and `@types/react-dom` to `^19.0.0` to match the installed `react@19.2.0`.

2.  **Source Bundle (`deploy.zip`)**:
    -   Created a new deployment zip file using `bestzip` to ensure **forward slash** path separators are used (fixing the Windows backslash issue).
    -   Included all necessary files: `package.json`, `package-lock.json`, config files, and source directories (`app`, `public`, `lib`, `components`, `scripts`).
    -   Excluded `node_modules`, `.next`, and `.git`.

3.  **Swap Space Configuration**:
    -   Added `.ebextensions/01_swap.config` to create a 2GB swap file. This prevents "Out of Memory" errors during the build process on t3.micro instances.
    -   Restored `"postinstall": "npm run build"` in `package.json` to ensure the build runs during deployment.

4.  **Database Configuration (`lib/db.ts`)**:
    -   Updated the database connection pool to prioritize environment variables (`PG*` and `DB_*`) over hardcoded defaults.
    -   This ensures the application connects to the RDS instance in production while maintaining local development defaults.

## Verification Results

### Build Verification
-   **Standard Install**: `npm install` followed by `npm run build` **PASSED**.
-   **Production Simulation**: `npm --omit=dev install` (which triggers `postinstall` -> `npm run build`) **PASSED**.
    -   This confirms that the application can build successfully in the AWS EB environment where `devDependencies` are not installed.

### Runtime Verification
-   **Local Start**: `npm start` successfully started the application.
-   **Page Check**: Verified that the homepage (`/`) loads correctly with all content and SEO metadata intact.

## Next Steps
1.  Upload `deploy.zip` to your AWS Elastic Beanstalk environment (`Inorderbookseries-env`).
2.  Deploy the version.
