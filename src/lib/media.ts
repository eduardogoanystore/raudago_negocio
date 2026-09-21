const BUCKET_URL = "https://storage.googleapis.com/media-raudago"

type MediaResult =
  | { type: "video"; p720: string; p480: string }
  | { type: "image"; thumb: string; medium: string; hd: string }

export function getOptimizedMediaUrls(path: string): MediaResult {
  const relativePath = path.startsWith(BUCKET_URL)
    ? path.slice(BUCKET_URL.length + 1)
    : path

  const extension = relativePath.split(".").pop()?.toLowerCase()

  if (extension === "svg") {
    const parts = relativePath.split("/")
    const fileName = parts.pop()!
    const dir = parts.join("/")
    const url = `${BUCKET_URL}/${dir}/${encodeURIComponent(fileName)}`
    return { type: "image", thumb: url, medium: url, hd: url }
  }

  const optimizedPath = relativePath.replace("/originals/", "/optimized/")
  const parts = optimizedPath.split("/")
  const fileName = parts.pop()!
  const baseDir = parts.join("/")

  if (["mp4", "mov", "webm", "ogg"].includes(extension || "")) {
    const baseName = fileName.replace(/\.[^/.]+$/, "")
    return {
      type: "video",
      p720: `${BUCKET_URL}/${baseDir}/${baseName}_720.mp4`,
      p480: `${BUCKET_URL}/${baseDir}/${baseName}_480.mp4`,
    }
  }

  const baseName = fileName.replace(/\.[^/.]+$/, "")
  return {
    type: "image",
    thumb:  `${BUCKET_URL}/${baseDir}/thumb_${baseName}.jpg`,
    medium: `${BUCKET_URL}/${baseDir}/medium_${baseName}.jpg`,
    hd:     `${BUCKET_URL}/${baseDir}/hd_${baseName}.jpg`,
  }
}
