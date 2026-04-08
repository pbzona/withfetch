export type HeaderMiddleware = () => Record<string, string> | Promise<Record<string, string>>;
