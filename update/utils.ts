import { wakatime } from "./interfaces.ts";

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

export function generateAsciiGraph(stats: wakatime) {
  if (
    stats.data === undefined || stats.data === null || stats.data.length === 0
  ) {
    return "";
  }
  const data = stats.data;
  let graph = "";
  for (let i = 0; i < data.length; i++) {
    graph += `${data[i].name}${repeat(' ', 10 - data[i].name.length)}[${repeat("#", data[i].percent)}] ${
      data[i].percent
    }%\n`;
  }
  return graph;
}

function repeat(str: string, times: number) {
  return new Array(Math.round(times) + 1).join(str);
}
