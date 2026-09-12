import { Globe } from "lucide-react";
import { useState } from "react";

interface ItemFaviconProps {
    url?: string;
    size: number;
}

function ItemFavicon({ url, size }: ItemFaviconProps) {
    // Track errors
    const [hasError, setHasError] = useState(false);

    // Create a url object to get the origin and append /favicon.ico
    let faviconUrl: string | null = null;

    if (url) {
        try {
            const parsedUrl = new URL(url.includes("://") ? url : `https://${url}`);
            faviconUrl = `${parsedUrl.origin}/favicon.ico`;
        } catch {
            // Invalid URL
            return <Globe size={size} />;
        }
    }

    if (!faviconUrl || hasError) {
        return <Globe size={size} />;
    }

    return (
        <img
            src={faviconUrl}
            alt=""
            width={size}
            height={size}
            onError={() => setHasError(true)}
        />
    );
}

export { ItemFavicon };