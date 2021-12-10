import { repos, wakatime } from "./interfaces.ts";

export function githubAPI(endpoint: string, type: string) {
  if (type === "text") {
    return fetch(`https://api.github.com${endpoint}`, {
      headers: {
        "Authorization": `token ${Deno.env.get("TOKEN")}`,
      },
    }).then((response) => response.text());
  } else if (type === "json") {
    return fetch(`https://api.github.com${endpoint}`, {
      headers: {
        "Authorization": `token ${Deno.env.get("TOKEN")}`,
      },
    }).then((response) => response.json());
  }
}

export function generateWakatimeGraph(stats: wakatime) {
  if (
    stats.data === undefined || stats.data === null || stats.data.length === 0
  ) {
    return "";
  }
  const data = stats.data;
  let graph = "";
  for (let i = 0; i < data.length; i++) {
    graph += `${data[i].name}${repeat(" ", 20 - data[i].name.length)}[${
      repeat("#", data[i].percent)
    }${repeat(" ", Math.floor(data[0].percent) - data[i].percent)}] ${
      data[i].percent
    }%\n`;
  }
  return graph.trimEnd();
}

export function generateGithubLanguageStats(repos: Array<repos>) {
  const languages = repos.filter((repo) => !repo.fork).map((repos) =>
    repos.language
  );
  const uniqueLanguages = [...new Set(languages)];
  const languageData = new Map<string, number>();
  uniqueLanguages.forEach((language) => {
    if (language == null) return;
    languageData.set(
      language ?? "Other",
      (languages.filter((lang) => lang === language).length /
        languages.length) * 100,
    );
  });
  const sortedLanguageData = [...languageData].sort(
    (a, b) => b[1] - a[1],
  );

  let graph = "";
  sortedLanguageData.forEach((data) => {
    graph += `${data[0]}${repeat(" ", 20 - data[0].length)}[${
      repeat("#", data[1])
    }${repeat(" ", sortedLanguageData[0][1] - data[1])}] ${data[1]}%\n`;
  });
  return graph.trimEnd();
}

function repeat(str: string, times: number) {
  return new Array(Math.floor(times) + 1).join(str);
}
