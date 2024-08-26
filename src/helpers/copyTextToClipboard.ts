export async function copyTextToClipboard(text: string) {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    // have to use this way as some browsers don't support Clipboard API
    return document.execCommand('copy', true, text);
  }
}
