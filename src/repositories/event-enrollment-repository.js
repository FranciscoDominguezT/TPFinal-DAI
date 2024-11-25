import DBConfig from "../configs/db-config.js";
import pkg from 'pg';
const { Client } = pkg;

export default class EventEnrollmentRepository {

  createAsync = async (entity) => {
    let returnArray = null;
    const client = new Client(DBConfig);

    console.log('Entity:' , entity);

    try {
      await client.connect();
      const sql = 'INSERT INTO event_enrollments (id_event, id_user, description, registration_date_time, attended, observations, rating) VALUES ($1, $2, $3, $4, $5, $6, $7)';
      const values = [
        entity.id_event, 
        entity.id_user, 
        entity.description, 
        entity.registration_date_time, 
        entity.attended ? '1': '0', 
        entity.observations, 
        entity.rating
      ];
      const result = await client.query(sql, values);
      await client.end();
      returnArray = result.rows;
    } catch (error) {
        console.log(error);
    } 
    return returnArray;
  }

  deleteAsync = async (eventId, userId) => {
    let returnArray = null;
    const client = new Client(DBConfig);

    try {
      await client.connect();
      const sql = 'DELETE FROM event_enrollments WHERE id_event = $1 AND id_user = $2 RETURNING *';
      const values = [eventId, userId];
      
      console.log("Executing delete enrollment with values:", { eventId, userId });
      
      const result = await client.query(sql, values);
      returnArray = result.rowCount > 0 ? { success: true } : null;
    } catch (error) {
      console.error("Error in deleteEnrollmentAsync:", error);
    } finally {
      await client.end();
    }
    return returnArray;
  }

  getAllAsync = async () => {
    let returnArray = null;
    const client = new Client(DBConfig);

    try {
      await client.connect();
      const sql = 'SELECT * FROM event_enrollments';
      const result = await client.query(sql);
      await client.end();
      returnArray = result.rows;
    } catch (error) {
      console.log(error);
    } 
    return returnArray;
  }

  updateAsync = async (eventId, entity, rating) => {
    let returnArray = null;
    const client = new Client(DBConfig);

    try {
      await client.connect();
      const sql = 'UPDATE event_enrollments SET observations = $1, rating = $2 WHERE id_event = $3';
      const values = [
        entity.observations, 
        rating, 
        eventId
      ]; 
      console.log("Executing SQL:", sql);
      console.log("With values:", values);
      const result = await client.query(sql, values);
      await client.end();
      returnArray = result.rows;
    } catch (error) {
      console.log(error);
    } 
    return returnArray;
  }

  checkEnrollmentStatus = async (eventId, userId) => {
    const client = new Client(DBConfig);
    try {
      await client.connect();
      const sql = "SELECT * FROM event_enrollments WHERE id_event = $1 AND id_user = $2";
      const values = [eventId, userId];
      
      console.log("Checking enrollment status with values:", { eventId, userId });
      
      const result = await client.query(sql, values);
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in checkEnrollmentStatus:", error);
      return null;
    } finally {
      await client.end();
    }
  }
}