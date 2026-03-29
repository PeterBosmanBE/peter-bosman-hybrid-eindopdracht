export function url(path: string = ""): string {
	let base = process.env.NEXT_PUBLIC_API_URL;

	// If no base is provided, fallback to localhost
	if (!base) {
		base = `http://localhost:${process.env.PORT ?? 3000}`;
	} 
	// If base doesn't have a protocol, prepend https://
	else if (!base.startsWith("http://") && !base.startsWith("https://")) {
		base = `https://${base}`;
	}

	// Use the native URL constructor to safely combine the base and path
	return new URL(path, base).toString();
}