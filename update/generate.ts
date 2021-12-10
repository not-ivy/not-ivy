// deno run --allow-env --allow-net --allow-read --allow-write update/generate.ts
import { repos, wakatime } from "./interfaces.ts";
import {
  generateGithubLanguageStats,
  generateWakatimeGraph,
  githubAPI,
} from "./utils.ts";
import { parse } from "https://deno.land/std@0.95.0/datetime/mod.ts";
import {
  activeRepoDays,
  archivedRepoCount,
  starredRepoCount,
} from "./config.ts";

const languageColors = [
  "fec5bb",
  "fcd5ce",
  "fae1dd",
  "f8edeb",
  "e8e8e4",
  "d8e2dc",
  "ece4db",
  "ffe5d9",
  "ffd7ba",
  "fec89a",
].sort(() => 0.5 - Math.random());

const otherColors = [
  "ec91d8",
  "f69ee1",
  "ffaaea",
  "ffb4ed",
  "ffbeef",
  "ffc9e5",
  "ffcee0",
  "ffd3da",
  "f4d3d5",
  "e9d3d0",
].sort(() => 0.5 - Math.random());

const githubZen: string = await githubAPI("/zen", "text");

const userRepos: Array<repos> = await githubAPI(
  "/user/repos?per_page=100",
  "json",
);
userRepos.sort((a, b) => (a.stargazers_count > b.stargazers_count) ? -1 : 1);

const uniqueLanguages: (string | null | undefined)[] = [
  ...new Set(userRepos.map((repo) => repo.language)),
].slice(0, 10);

const wakatime: wakatime = await fetch(
  "https://wakatime.com/share/@sourTaste000/36041030-af34-400d-999b-03c7373c0611.json",
).then((res) => res.json());
wakatime.data?.sort((a, b) => (a.percent > b.percent) ? -1 : 1);
let template: string = await Deno.readTextFile("./template.md");

// Random Quote================================================
template = template.replace("%zen%", githubZen);
// ============================================================

// Active Repos=================================================
const activeRepos = [];
for (const repo of userRepos) {
  if (
    parse(repo.updated_at, "yyyy-MM-ddTHH:mm:ssZ").getTime() >
      new Date().getTime() - (1000 * 60 * 60 * 24 * activeRepoDays) &&
    !repo.fork && !repo.archived
  ) {
    activeRepos.push(
      `- [${repo.owner.login}/${repo.name}](${repo.html_url}) ${repo.description} ★${repo.stargazers_count}`,
    );
  }
}
template = template.replace("%active%", activeRepos.join("\n"));
// ============================================================

// Top 5 starred repos=========================================
template = template.replace(
  "%starred%",
  userRepos.slice(0, starredRepoCount).map((repo) =>
    `- [${repo.owner.login}/${repo.name}](${repo.html_url}) ${repo.description} ★${repo.stargazers_count}`
  ).join("\n"),
);
// ============================================================

// Wakatime Graph==============================================
template = template.replace(
  "%wakatime%",
  generateWakatimeGraph(wakatime),
);
// ============================================================

// Archived Repos==============================================
template = template.replace(
  "%archived%",
  userRepos.filter((repo) => repo.archived).filter((repo) =>
    repo.stargazers_count >= 1
  ).map((repo) =>
    `- [${repo.owner.login}/${repo.name}](${repo.html_url}) ${repo.description} ★${repo.stargazers_count}`
  ).slice(0, archivedRepoCount).join("\n"),
);
// ============================================================

// Languages You Use===========================================
template = template.replace(
  "%languages%",
  uniqueLanguages.map((language) =>
    `<img src="https://img.shields.io/badge/-${
      language ?? "other"
    }-${languageColors.pop()}" />`
  ).join("\n"),
);
// ============================================================

// Random Colors===============================================
// is there a better way to do this?
const regex = /%randomcolor%/g;
let match;
while ((match = regex.exec(template)) !== null) {
  template = template.replace(
    match[0],
    otherColors.pop() ?? "9b90ff",
  );
}
// ============================================================

// Languages Graph=============================================
template = template.replace(
  "%languages%",
  generateGithubLanguageStats(userRepos),
);
// ============================================================

await Deno.writeTextFile("./README.md", template);
