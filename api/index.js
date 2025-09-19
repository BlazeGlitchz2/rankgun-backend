// RankGun backend (c) BL4ZE
import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("tiny"));

const PORT = process.env.PORT || 3000;
const OPEN_CLOUD_KEY = process.env.ROBLOX_OPEN_CLOUD_KEY;
const OPEN_CLOUD_BASE = process.env.OPEN_CLOUD_BASE || "https://apis.roblox.com";
const SHARED_SECRET = process.env.SHARED_SECRET || null;

app.get("/", (_, res) => res.send("RankGun backend up (c) BL4ZE"));
app.get("/health", (_, res) => res.json({ ok: true, ts: Date.now() }));

function verifyShared(req) {
  if (!SHARED_SECRET) return true;
  const header = req.header("x-rg-shared");
  return header && header === SHARED_SECRET;
}

async function setUserRoleOpenCloud({ groupId, targetUserId, newRoleId, reason }) {
  const url = `${OPEN_CLOUD_BASE}/groups/v1/groups/${groupId}/roles/${newRoleId}/users/${targetUserId}`;
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": OPEN_CLOUD_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reason: reason || "RankGun promotion (c) BL4ZE" })
  });
  if (!r.ok) {
    const text = await r.text();
    return { ok: false, status: r.status, detail: text };
  }
  return { ok: true };
}

app.post("/rank", async (req, res) => {
  if (!verifyShared(req)) return res.status(401).json({ error: "unauthorized" });
  const { groupId, targetUserId, newRoleId, reason } = req.body || {};
  if (!groupId || !targetUserId || !newRoleId) return res.status(400).json({ error: "missing params" });
  if (!OPEN_CLOUD_KEY) return res.status(500).json({ error: "server-misconfigured: ROBLOX_OPEN_CLOUD_KEY missing" });
  try {
    const result = await setUserRoleOpenCloud({ groupId, targetUserId, newRoleId, reason });
    if (!result.ok) return res.status(502).json({ error: "open-cloud", status: result.status, detail: result.detail });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

app.listen(PORT, () => console.log(`RankGun backend (c) BL4ZE listening on :${PORT}`));
