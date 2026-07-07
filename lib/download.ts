const trimValue = (value: string | undefined) => value?.trim() || ""

export const iosDownloadUrl = trimValue(process.env.NEXT_PUBLIC_IOS_DOWNLOAD_URL)
export const androidDownloadUrl = trimValue(process.env.NEXT_PUBLIC_ANDROID_DOWNLOAD_URL)
export const configuredPrimaryDownloadUrl = trimValue(process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL)
export const appStoreId = trimValue(process.env.NEXT_PUBLIC_APP_STORE_ID)

export const primaryDownloadUrl =
  configuredPrimaryDownloadUrl || iosDownloadUrl || androidDownloadUrl || "/download"

export const hasConfiguredDownloadUrl = Boolean(
  configuredPrimaryDownloadUrl || iosDownloadUrl || androidDownloadUrl
)

export function externalLinkProps(href: string) {
  if (!href.startsWith("http://") && !href.startsWith("https://")) {
    return {}
  }

  return {
    target: "_blank",
    rel: "noopener noreferrer",
  }
}
