import { wakatime } from './interfaces.ts';

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
  if ( stats.data === undefined || stats.data === null || stats.data.length  === 0) {
    return '';
  }
  // {"data": [{"color": "#F18E33", "name": "Kotlin", "percent": 64.07}, {"color": "#f1e05a", "name": "JavaScript", "percent": 14.71}, {"color": "#e44b23", "name": "HTML", "percent": 7.52}, {"color": "#16ce40", "name": "Properties", "percent": 4.87}, {"color": "#dc9658", "name": "Bash", "percent": 4.03}, {"color": "#b07219", "name": "Java", "percent": 2.35}, {"color": "#cb171e", "name": "YAML", "percent": 0.78}, {"color": "#d62728", "name": "JSON", "percent": 0.69}, {"color": "#9467bd", "name": "Text", "percent": 0.68}, {"color": "#e69f56", "name": "Groovy", "percent": 0.30}]}
  const data = stats.data;
  let graph = '';
  for (let i = 0; i < data.length; i++) {
    graph += `${data[i].name} [${repeat('#', data[i].percent)}] ${data[0].percent}%\n`;
  }
  return graph;
}

function repeat(str: string, times: number) {
  return new Array(Math.round(times) + 1).join(str);
}