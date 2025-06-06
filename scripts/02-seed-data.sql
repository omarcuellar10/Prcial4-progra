-- Insertar categorías de consulta médica
INSERT INTO consultation_categories (name, description, priority_level) VALUES
('Citas Médicas', 'Solicitudes de citas, reagendamiento y cancelaciones', 2),
('Resultados de Exámenes', 'Consultas sobre resultados de laboratorio y estudios', 3),
('Emergencias', 'Situaciones médicas urgentes que requieren atención inmediata', 4),
('Información General', 'Preguntas generales sobre servicios y procedimientos', 1),
('Facturación', 'Consultas sobre cobros, seguros y pagos', 2),
('Medicamentos', 'Preguntas sobre prescripciones y efectos secundarios', 3),
('Seguimiento Post-Consulta', 'Seguimiento después de consultas médicas', 2),
('Quejas y Sugerencias', 'Comentarios sobre el servicio recibido', 2);

-- Insertar algunos clientes de ejemplo
INSERT INTO customers (name, email, phone) VALUES
('María González', 'maria.gonzalez@email.com', '+1234567890'),
('Carlos Rodríguez', 'carlos.rodriguez@email.com', '+1234567891'),
('Ana Martínez', 'ana.martinez@email.com', '+1234567892'),
('Luis Hernández', 'luis.hernandez@email.com', '+1234567893'),
('Carmen López', 'carmen.lopez@email.com', '+1234567894');

-- Insertar algunas consultas de ejemplo
INSERT INTO consultations (customer_id, category_id, subject, message, status, priority_level, sentiment_score, confidence_score) VALUES
(1, 1, 'Solicitud de cita con cardiólogo', 'Necesito agendar una cita con el cardiólogo lo antes posible', 'resolved', 2, 0.1, 0.85),
(2, 3, 'Dolor en el pecho', 'Tengo un dolor fuerte en el pecho desde hace una hora', 'resolved', 4, -0.3, 0.92),
(3, 2, 'Resultados de análisis de sangre', '¿Cuándo estarán listos mis resultados de laboratorio?', 'resolved', 3, 0.2, 0.78),
(4, 4, 'Información sobre seguro médico', '¿Qué servicios cubre mi seguro médico?', 'resolved', 1, 0.5, 0.65),
(5, 6, 'Efectos secundarios de medicamento', 'El medicamento que me recetaron me está causando náuseas', 'in_progress', 3, -0.2, 0.88);
