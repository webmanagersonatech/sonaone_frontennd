export function getImageUrl(image?: string | null): string {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${process.env.NEXT_PUBLIC_S3_BASE_URL}/${image}`;
}