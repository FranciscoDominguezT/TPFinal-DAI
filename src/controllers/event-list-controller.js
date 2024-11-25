import {Router} from "express";
import EventListService from '../services/event-list-service.js';

const router = Router();
const svc = new EventListService();

// router.get('', async (req, res) => {
//     let response;
//     const returnArray = await svc.getAllAsync();

//     if (returnArray != null) {
//         response = res.status(200).json(returnArray);
//     } else {
//         response = res.status(500).send('Error interno');
//     }
//     return response;
// });

router.get('/:id', async (req, res) => {
    let response;
    const element = req.params.id;
    console.log("Request for event details, ID:", element);
    
    const returnArray = await svc.getDetailsAsync(element);
    if (returnArray != null) {
      console.log("Details sent to client:", returnArray);
      response = res.status(200).json(returnArray);
    } else {
      response = res.status(404).send('Evento no encontrado');
    }
    return response;
});

router.get('/:id/enrollment', async (req, res) => {
    let response;
    const eventId = req.params.id;
    
    const returnArray = await svc.getParticipantsAsync(eventId);
    if (returnArray != null) {
      response = res.status(200).json(returnArray);
    } else {
      response = res.status(404).send('Evento no encontrado');
    }
    return response;
});
router.get('/', async (req, res) => {
  console.log("Query params:", req.query);
  const filters = {
    name: req.query.name,
    category: req.query.category ? parseInt(req.query.category, 10) : undefined, 
    startdate: req.query.start_date, 
    tag: req.query.tag,
    limit: parseInt(req.query.limit || '100', 10),
    offset: parseInt(req.query.offset || '0', 10),
  };
  console.log("Filters:", filters);

  try {
    const result = await svc.getEventsAsync(filters);
    console.log("Return array:", result);
    if (result && result.events.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ events: [], total: 0 }); // Cambiar a 200 y devolver array vacío
    }
  } catch (error) {
    console.error("Error in controller:", error);
    res.status(500).send('Error interno del servidor');
  }
});

export default router;