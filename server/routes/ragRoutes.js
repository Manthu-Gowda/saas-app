import express from 'express';
import multer from 'multer';
import { uploadDocument, listDocuments, deleteDocument, queryDocuments } from '../controllers/ragController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/documents', listDocuments);
router.delete('/documents/:docId', deleteDocument);
router.post('/query', queryDocuments);

export default router;
