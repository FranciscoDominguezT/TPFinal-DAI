import { Router } from "express";
import EventService from "../services/event-service.js";
import EventLocationService from "../services/event-location-service.js";
import EventEnrollmentService from "../services/event-enrollment-service.js";
import AuthMiddleware from "../middlewares/auth-middleware.js";
import { boolean } from "zod";

const router = Router();
const EventSvc = new EventService();
const EventLocationSvc = new EventLocationService();
const EventEnrollmentSvc = new EventEnrollmentService();

router.post("/:id/enrollment", AuthMiddleware.validateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    console.log('User ID from token:', userId);

    // Verificar si ya está inscrito
    const existingEnrollment = await EventEnrollmentSvc.checkEnrollmentStatus(eventId, userId);
    if (existingEnrollment) {
      return res.status(400).json({ error: "Ya estás inscrito en este evento." });
    }

    const event = await EventSvc.getByIdAsync(eventId);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    const eventLocation = await EventLocationSvc.getByIdAsync(event.id_event_location);

    if (event.enabled_for_enrollment !== '1') {
      return res.status(400).json({ error: "El evento no admite inscripciones." });
    }

    if (event.start_date <= new Date()) {
      return res.status(400).json({ error: "El evento ya ha comenzado o está ocurriendo hoy." });
    }

    if (eventLocation.max_capacity <= event.max_assistance) {
      return res.status(400).json({ error: "La capacidad máxima del evento ha sido alcanzada." });
    }

    const enrollment = {
      id_event: eventId,
      id_user: userId,
      description: null,
      registration_date_time: new Date(),
      attended: true,
      observations: null,
      rating: null,
    };

    const result = await EventEnrollmentSvc.createAsync(enrollment);
    if (result != null) {
      res.status(201).json({ message: "Inscripción exitosa" });
    } else {
      res.status(500).json({ error: "Error al crear la inscripción" });
    }
  } catch (error) {
    console.error('Error in enrollment:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.delete("/:id/enrollment", AuthMiddleware.validateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    console.log('Deleting enrollment - Event ID:', eventId, 'User ID:', userId);

    if (!userId) {
      return res.status(400).json({ error: "ID de usuario no válido" });
    }

    // Verificar si está inscrito
    const enrollment = await EventEnrollmentSvc.checkEnrollmentStatus(eventId, userId);
    if (!enrollment) {
      return res.status(404).json({ error: "No estás inscrito en este evento" });
    }

    const event = await EventSvc.getByIdAsync(eventId);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    if (new Date(event.start_date) <= new Date()) {
      return res.status(400).json({ error: "No puedes desuscribirte de un evento que ya comenzó" });
    }

    const result = await EventEnrollmentSvc.deleteAsync(eventId, userId);
    if (result !== null) {
      res.status(200).json({ message: "Desuscripción exitosa" });
    } else {
      res.status(500).json({ error: "Error al eliminar la inscripción" });
    }
  } catch (error) {
    console.error('Error in unenrollment:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

//El siguiente patch Actualiza un event_enrollment que es enviado por parámetro con un valor que es enviado por parámetro, para el usuario autenticado. El feedback (observations) debe enviarse en el cuerpo del mensaje (puede estar vacío).

router.patch("/:id/enrollment/:num", AuthMiddleware.validateToken, async (req, res) => {
  let response;
  const entity = req.body;
  const eventId = req.params.id;
  const rating = req.params.num; 

  const event = await EventSvc.getByIdAsync(eventId);

  if (!event) {
    return res.status(404).json({ error: "Evento no encontrado" });
  }

  if (new Date(event.start_date) < new Date()) {
    return res.status(400).json({ error: "El evento aún no ha finalizado" });
}

  if (rating < 1 || rating > 10) {
    return res.status(400).json({ error: "El rating debe estar entre 1 y 10" });
  }

  const enrollment = await EventEnrollmentSvc.updateAsync(eventId, entity, rating); 

  if (enrollment != null) {
    response = res.status(200).json(enrollment);
  } else {
    response = res.status(404).send("ID de evento no encontrado");
  }
  
  return response;
});

router.get("/:id/check-enrollment", AuthMiddleware.validateToken, async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user.id;

    const enrollment = await EventEnrollmentSvc.checkEnrollmentStatus(eventId, userId);
    res.status(200).json({ isSubscribed: enrollment !== null });
  } catch (err) {
    console.error("Error checking enrollment status:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;