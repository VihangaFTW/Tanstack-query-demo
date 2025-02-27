import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function fetchEvents(searchTerm = null) {
  let url = "http://localhost:3000/events";
  if (searchTerm) {
    url += "?search=" + searchTerm;
  }
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}

export async function createNewEvent({ event: eventData }) {
  const response = await fetch("http://localhost:3000/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ event: eventData }),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();
  return event;
}

export async function fetchImages() {
  const response = await fetch("http://localhost:3000/events/images");

  if (!response.ok) {
    const error = new Error("Failed to fetch images");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { images } = await response.json();
  return images;
}

export async function fetchEvent(id) {
  const response = await fetch("http://localhost:3000/events/" + id);

  if (!response.ok) {
    const error = new Error("Failed to fetch event details!");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const { event } = await response.json();
  return event;
}

export async function deleteEvent(id) {
  const response = await fetch("http://localhost:3000/events/" + id, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = new Error("Failed to delete event!");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  // event deleted message
  const { message } = await response.json();
  return message;
}

export async function updateEvent({ id, event }) {
  const response = await fetch("http://localhost:3000/events/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify( {event} ),
  });

  if (!response.ok) {
    const error = new Error("An error occurred while updating the event.");
    error.code = error.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
