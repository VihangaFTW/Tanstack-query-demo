import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../../UI/Modal.jsx";
import EventForm from "../EventForm.jsx";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../../util/http.js";

import ErrorBlock from "../../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();

  const { id } = useParams();

  const { data, isError, error } = useQuery({
    queryKey: ["events", { id }],
    queryFn: () => fetchEvent(id),
    staleTime: 5000,
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    mutationKey: ["events", { id, type: "update" }],
    onMutate: async (mutateInputs) => {
      // cancel outgoing refetches for queries with the same key
      await queryClient.cancelQueries(["events", { id }]);

      // get current cached event data
      const previousEvent = queryClient.getQueryData(["events", { id }]);

      // mutateInputs is the same input passed into the mutate() function call
      const newData = mutateInputs.event;
      queryClient.setQueryData(["events", { id }], newData);

      return { previousEvent };
    },

    onError: (error, data, context) => {
      queryClient.setQueryData(["events", { id }], context.previousEvent);
    },

    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["events", { id }],
      }),
  });

  function handleSubmit(formData) {
    mutate({
      id,
      event: formData,
    });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event details"
          message={
            error.info?.message || "An error occurred. Please try again later."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        <Link to="../" className="button-text">
          Cancel
        </Link>
        <button type="submit" className="button">
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}
