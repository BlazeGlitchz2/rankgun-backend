# RankGun Backend (c) BL4ZE

Minimal Express backend to set Roblox group roles via Open Cloud.

## Endpoints
- `GET /` -> sanity text
- `GET /health` -> `{ ok: true }`
- `POST /rank` -> body:
  ```json
  {
    "groupId": 123456,
    "targetUserId": 987654321,
    "newRoleId": 112233,
    "reason": "Promotion (c) BL4ZE"
  }
  ```

## Environment (.env or platform secrets)
- `ROBLOX_OPEN_CLOUD_KEY` **(required)**: Open Cloud API key scoped to your **Group** with permissions to manage roles.
- `PORT` *(optional)*: default 3000.
- `SHARED_SECRET` *(optional recommended)*: if set, the backend expects a header `x-rg-shared: <this value>` from Roblox.
- `OPEN_CLOUD_BASE` *(optional)*: default `https://apis.roblox.com`.

## Run locally
```bash
npm i
cp .env.example .env  # then fill values
npm start
```

## Deploy
- **Replit**: create Node.js repl, upload files, add secrets, Run.
- **Vercel/Render/Fly/Cloudflare Workers** also work with minor tweaks.

## Roblox-side headers
If you set `SHARED_SECRET`, send `x-rg-shared` header from Roblox (HttpService) to block random callers.

## Note on Open Cloud path
The exact Groups endpoint can evolve. This project uses:
`https://apis.roblox.com/groups/v1/groups/{groupId}/roles/{newRoleId}/users/{targetUserId}` (POST)
Check official docs and adjust in `index.js` if needed.
