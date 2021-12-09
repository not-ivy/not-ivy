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
