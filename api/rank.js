// /api/rank.js  (c) BL4ZE
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const OPEN_CLOUD_KEY = process.env.ROBLOX_OPEN_CLOUD_KEY;
  const OPEN_CLOUD_BASE = process.env.OPEN_CLOUD_BASE || "https://apis.roblox.com";
  const SHARED_SECRET = process.env.SHARED_SECRET || null;

  if (!OPEN_CLOUD_KEY) {
    return res.status(500).json({ error: "server-misconfigured: ROBLOX_OPEN_CLOUD_KEY missing" });
  }

  if (SHARED_SECRET) {
    const header = req.headers["x-rg-shared"];
    if (!header || header !== SHARED_SECRET) {
      return res.status(401).json({ error: "unauthorized" });
    }
  }

  try {
    const { groupId, targetUserId, newRoleId, reason } = req.body || {};
    if (!groupId || !targetUserId || !newRoleId) {
      return res.status(400).json({ error: "missing params" });
    }

    // Cloud v2 membership PATCH with role.id
    const url = `${OPEN_CLOUD_BASE}/cloud/v2/groups/${groupId}/memberships/${targetUserId}`;
    const r = await fetch(url, {
      method: "PATCH",
      headers: {
        "x-api-key": OPEN_CLOUD_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        role: { id: newRoleId },
        reason: reason || "RankGun promotion (c) BL4ZE"
      })
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: "open-cloud", status: r.status, detail: text });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "server" });
  }
}
