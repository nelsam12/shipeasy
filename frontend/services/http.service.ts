import { BodyType } from "@/lib/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type JsonBody = object;
type HttpBody = JsonBody | FormData;

interface HttpOptions<TBody extends HttpBody | undefined> {
  method: HttpMethod;
  body?: TBody;
  bodyType?: BodyType;
}

export async function http<TResponse, TBody extends HttpBody | undefined>(
  url: string,
  options: HttpOptions<TBody>
): Promise<TResponse> {
  let response: Response;

  const isFormData = options.bodyType === BodyType.FORM_DATA;

  try {
    response = await fetch(`${API_URL}${url}`, {
      method: options.method,
      credentials: "include",
      headers: isFormData ? undefined : { "Content-Type": BodyType.JSON },
      body: options.body
        ? isFormData
          ? (options.body as FormData)
          : JSON.stringify(options.body)
        : undefined,
    });
  } catch {
    throw new Error("Impossible de contacter le serveur");
  }

  const contentType = response.headers.get("content-type");
  let data: TResponse | null = null;

  if (contentType?.includes("application/json")) {
    data = (await response.json()) as TResponse;
  }

  if (!response.ok) {
    throw new Error(
      (data as { message?: string } | null)?.message ??
        "Une erreur est survenue"
    );
  }

  return data as TResponse;
}
