# APBuddy

Accounts-payable workspace demo (Admin + AP Staff), scaffolded from the
[APBUDDY Figma](https://www.figma.com/design/uli6Rx1PxnzFIrOq2lwFWX/%F0%9F%92%BC-APBUDDY_Design--Copy-?node-id=2196-46262)
(`Admin_R1` / `APstaff_R1`). Static Vite app — no backend.

## Run

```bash
cd /home/bnb/Projects/local-projects/apbuddy
npm install
npm run dev
```

Open http://localhost:2070

## Demo logins

| Role     | Email                 | Password   |
|----------|-----------------------|------------|
| Admin    | `admin@apbuddy.local` | `Admin@123` |
| AP Staff | `staff@apbuddy.local` | `Staff@123` |

## Deploy (Vercel)

- Framework: Vite
- Build: `npm run build`
- Output: `dist`
- SPA rewrites in `vercel.json`
