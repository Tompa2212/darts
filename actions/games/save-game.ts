export default async function saveGame(game: any) {
  return fetch('/api/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(game)
  }).then((res) => res.json());
}
