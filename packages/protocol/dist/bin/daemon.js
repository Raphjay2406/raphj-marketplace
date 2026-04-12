import { startDaemon } from "../daemon.js";
import { readFileSync } from "fs";
const cards = JSON.parse(readFileSync(".claude-plugin/generated/agent-cards.json", "utf8"));
const agents = new Map();
for (const card of cards) {
    const name = card.id.split("/")[1];
    agents.set(name, {
        card,
        handler: async () => ({
            schema_version: "4.0.0",
            status: "ok",
            artifact: { stub: true, agent: card.id },
            verdicts: [],
            followups: []
        })
    });
}
startDaemon({ host: "127.0.0.1", port: 0, agents }).then(d => {
    console.log(JSON.stringify({ url: d.url, port: d.port, pid: process.pid }));
});
