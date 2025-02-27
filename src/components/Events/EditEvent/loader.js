import { queryClient } from "../../../util/http";
import { fetchEvent } from "../../../util/http";

export default function editEventLoader({ params }) {
  const id = params.id;
  return queryClient.fetchQuery({
    queryKey: ["events", { id }],
    queryFn: () => fetchEvent(params.id),
  });
}


