// deno run --allow-env --allow-net --allow-read --allow-write update/generate.ts
import { repos, wakatime } from "./interfaces.ts";
import { generateWakatimeGraph, githubAPI } from "./utils.ts";
import { parse } from "https://deno.land/std@0.95.0/datetime/mod.ts";

// const languageColors = await fetch(
//   "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json",
// ).then((r) => r.json());
const languageColors = [
  "413c58",
  "5a5e71",
  "72808a",
  "a3c4bc",
  "b1ceb9",
  "bfd7b5",
  "d3e3bd",
  "e7efc5",
  "edebc7",
  "f2e7c9",
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
    `<img src="https://img.shields.io/badge/-${
      language ?? "other"
    }-${languageColors.pop()}" />`
  ).join("\n"),
);

template = template.replace("%active%", activeRepos.join("\n"));

// is there a better way to do this?
const regex = /%randomcolor%/g;
let match;
while ((match = regex.exec(template)) !== null) {
  template = template.replace(
    match[0],
    otherColors.pop() ?? "9b90ff",
  );
}

await Deno.writeTextFile("./README.md", template);
