// deno run --allow-env --allow-net --allow-read --allow-write update/generate.ts
import { repos, wakatime } from "./interfaces.ts";
import { generateWakatimeGraph, githubAPI } from "./utils.ts";
import { parse } from "https://deno.land/std@0.95.0/datetime/mod.ts";

const languageColors = await fetch(
  "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
).then((r) => r.json());
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

template = template.replace("%zen%", githubZen);

const activeRepos = [];
for (const repo of userRepos) {
  if (
    parse(repo.updated_at, "yyyy-MM-ddTHH:mm:ssZ").getTime() >
      new Date().getTime() - (1000 * 60 * 60 * 24 * 7) &&
    !repo.fork && !repo.archived
  ) {
    activeRepos.push(
      `- [${repo.owner.login}/${repo.name}](${repo.html_url}) ${repo.description} ★${repo.stargazers_count}`,
    );
  }
}
template = template.replace(
  "%starred%",
  userRepos.slice(0, 5).map((repo) =>
    `- [${repo.owner.login}/${repo.name}](${repo.html_url}) ${repo.description} ★${repo.stargazers_count}`
  ).join("\n"),
);

template = template.replace(
  "%wakatime%",
  generateWakatimeGraph(wakatime),
);

template = template.replace(
  "%archived%",
  userRepos.filter((repo) => repo.archived).filter((repo) =>
    repo.stargazers_count >= 1
  ).map((repo) =>
    `- [${repo.owner.login}/${repo.name}](${repo.html_url}) ${repo.description} ★${repo.stargazers_count}`
  ).join("\n"),
);

template = template.replace(
  "%languages%",
  uniqueLanguages.map((language) =>
    `https://img.shields.io/badge/-${language}-9b90ff}`
  ).join("\n"),
);
template = template.replace("%active%", activeRepos.join("\n"));

await Deno.writeTextFile("./README.md", template);
