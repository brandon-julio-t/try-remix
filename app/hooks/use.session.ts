import { Session } from "remix";
import { commitSession, getSession } from "~/session";

export default async function useSession(
  fn: (session: Session) => Response | Promise<Response>,
  request: Request
) {
  const session = await getSession(request.headers.get("Cookie"));
  const response = await fn(session);
  response?.headers?.set("Set-Cookie", await commitSession(session));
  return response;
}
