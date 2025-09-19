# RankGun Backend — Vercel Serverless (c) BL4ZE

This version is tailored for Vercel. It exposes:
- `POST /api/rank` — promotes a user to a new **roleId** via Roblox Open Cloud **cloud v2**.
- `GET  /api/health` — health check.

## Environment Variables (Vercel → Project → Settings → Environment Variables)
- `ROBLOX_OPEN_CLOUD_KEY` **(required)** — your Open Cloud API key (scoped to your Group, Manage Roles).
- `SHARED_SECRET` **(recommended)** — long random string; the same value must be sent as header `x-rg-shared` from Roblox.
- `OPEN_CLOUD_BASE` *(optional)* — default `https://apis.roblox.com`.

## Request to /api/rank
POST headers:
```
Content-Type: application/json
x-rg-shared: <your SHARED_SECRET>   # if you set one
```
Body:
```json
{
  "groupId": 1234567,
  "targetUserId": 987654321,
  "newRoleId": 112233,
  "reason": "Promotion (c) BL4ZE"
}
```

## Notes
- `newRoleId` is the **role Id**, not the rank number.
- The user must already be in the group.
- The API key owner must have permission to change roles in the group.
- The function uses: `PATCH {OPEN_CLOUD_BASE}/cloud/v2/groups/{groupId}/memberships/{targetUserId}` with body `{ "role": { "id": <roleId> } }`.

## Deploy
Push this folder to your GitHub repo connected to Vercel. Make sure the files are in the repo **root** exactly as shown:
```
/api/rank.js
/api/health.js
package.json
README.md
```
Vercel auto-deploys and your endpoint will be:
`https://<your-project>.vercel.app/api/rank`
