import { Router } from "express";
import SolicitudeCtrl from '../Controllers/SolicitudeController.js'

const router =  Router()

//App Routes
router.post("/createSolicitude", SolicitudeCtrl.createSolicitude)
router.get("/getSolicitudesAlls", SolicitudeCtrl.getsSolicitudesAll)
router.get("/getSolicitudeById/:id", SolicitudeCtrl.getSolicitudeById)
router.get("/getSolicitudeBySenderId/:id", SolicitudeCtrl.getSolicitudesBySender_Id)
router.get("/getSolicitudeByDestinationUsername/:id", SolicitudeCtrl.getSolicitudesByDestination_Username)
router.post("/acceptSolicitude/:id", SolicitudeCtrl.acceptSolicitude)
router.delete("/deleteSolicitudeById/:id", SolicitudeCtrl.deleteSolicitudeById)
export default router;