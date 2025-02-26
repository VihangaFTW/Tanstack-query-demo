import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "../Header.jsx";
import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryFn: () => fetchEvent(id),
    queryKey: ["event", { id }],
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    mutationKey: ["event-delete", { id }],
    onSuccess: () => {
      queryClient.invalidateQueries(
        {queryKey: ['events']}
      );
      navigate("/events");
    },
  });

  function handleDelete() {
    mutate(id);
  }
  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {isPending && <p>Event Details loading...</p>}
        {isError && (
          <ErrorBlock title="An error occured" message={error.info?.message} />
        )}
        {!isPending && (
          <>
            <header>
              <h1>{data.title}</h1>
              <nav>
                <button onClick={handleDelete}>Delete</button>
                <Link to="edit">Edit</Link>
              </nav>
            </header>
            <div id="event-details-content">
              <img src={"http://localhost:3000/" + data.image} alt="" />
              <div id="event-details-info">
                <div>
                  <p id="event-details-location">{data.location}</p>
                  <time dateTime={`${data.date}T${data.time}`}>
                    {data.date} @{data.time}
                  </time>
                </div>
                <p id="event-details-description">{data.description}</p>
              </div>
            </div>
          </>
        )}
      </article>
    </>
  );
}
