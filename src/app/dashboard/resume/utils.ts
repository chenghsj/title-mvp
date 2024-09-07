export function getYouTubeVideoId(url: string): string | null {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?[\S]*)?/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
