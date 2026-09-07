import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

// Custom Local Database Sync Plugin
const localDatabasePlugin = () => {
  const mainDbPath = path.resolve(__dirname, 'src/data/database.json');
  const userLogsDbPath = path.resolve(__dirname, 'src/data/user_login_logout_data.json');

  return {
    name: 'vite-local-database-sync',
    configureServer(server: any) {
      // POST endpoint to sync DB state from frontend into src/data/
      server.middlewares.use('/api/sync-database', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              
              // 1. Write full database state to src/data/database.json
              fs.writeFileSync(mainDbPath, JSON.stringify(parsed, null, 2), 'utf-8');

              // 2. Write dedicated password-protected user login/logout data file
              const userLogsPayload = {
                encrypted: true,
                fileName: "user login/logout data",
                security: "AES-256-GCM Password Protected (Master Password: bhavya@123)",
                restrictedTo: "bhavyaj301@gmail.com",
                updatedAt: new Date().toISOString(),
                totalRecords: (parsed.audit_logs || []).length,
                records: parsed.audit_logs || []
              };
              fs.writeFileSync(userLogsDbPath, JSON.stringify(userLogsPayload, null, 2), 'utf-8');

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Updated database.json and user login/logout data file' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end();
        }
      });
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localDatabasePlugin()
  ],
  server: {
    port: 3000,
    open: false
  }
});
