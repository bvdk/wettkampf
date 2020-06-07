export default function filename(file) {
  const matches = file.match(/(.*)\.[^.]+$/);
  if (matches.length > 1) {
    return matches[1];
  }
  return file;
}
